const crypto = require("crypto");
const fs = require("fs");
const http = require("http");
const path = require("path");
const { URL } = require("url");

const PORT = Number(process.env.PORT || 4173);
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const STATE_FILE = path.join(DATA_DIR, "app-state.json");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const sessions = new Map();

ensureDataDir();
ensureDevUsers();

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }

    serveStatic(req, res, url);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: "Internal server error" });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Champion Transaction CRM running at http://127.0.0.1:${PORT}`);
});

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/login") {
    const body = await readJson(req);
    const user = authenticate(body.email, body.password);
    if (!user) {
      sendJson(res, 401, { error: "Invalid email or password" });
      return;
    }
    const token = crypto.randomBytes(32).toString("hex");
    sessions.set(token, { userId: user.id, createdAt: Date.now() });
    res.setHeader("Set-Cookie", cookieHeader("crm_session", token, { maxAge: 60 * 60 * 8 }));
    sendJson(res, 200, { user: publicUser(user) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/logout") {
    const token = getSessionToken(req);
    if (token) sessions.delete(token);
    res.setHeader("Set-Cookie", cookieHeader("crm_session", "", { maxAge: 0 }));
    sendJson(res, 200, { ok: true });
    return;
  }

  const user = requireUser(req, res);
  if (!user) return;

  if (req.method === "GET" && url.pathname === "/api/session") {
    sendJson(res, 200, { user: publicUser(user) });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/state") {
    const state = readState();
    sendJson(res, 200, { user: publicUser(user), state: state ? stateForUser(state, user) : null });
    return;
  }

  if (req.method === "PUT" && url.pathname === "/api/state") {
    if (user.role !== "agent") {
      sendJson(res, 403, { error: "Only agent accounts can replace application state." });
      return;
    }
    const body = await readJson(req);
    writeState(body.state);
    sendJson(res, 200, { ok: true, state: body.state });
    return;
  }

  const commentMatch = url.pathname.match(/^\/api\/transactions\/([^/]+)\/comments$/);
  if (req.method === "POST" && commentMatch) {
    const txId = decodeURIComponent(commentMatch[1]);
    const state = readState();
    if (!state) {
      sendJson(res, 409, { error: "No application state exists yet. Log in as an agent first." });
      return;
    }
    const tx = state.transactions.find((item) => item.id === txId);
    if (!tx || !canAccessTransaction(state, user, tx)) {
      sendJson(res, 404, { error: "Transaction not found." });
      return;
    }
    const body = await readJson(req);
    tx.messages = tx.messages || [];
    tx.messages.unshift({
      id: `msg-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
      channel: "comment",
      direction: "inbound",
      visibility: "client",
      status: "posted",
      author: user.name,
      subject: `${roleLabel(user.role)} comment`,
      to: "Transaction team",
      createdAt: new Date().toISOString(),
      body: String(body.body || "").trim(),
      relatedTaskId: null
    });
    writeState(state);
    sendJson(res, 200, { state: stateForUser(state, user) });
    return;
  }

  sendJson(res, 404, { error: "API route not found." });
}

function serveStatic(req, res, url) {
  const pathname = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const target = path.normalize(path.join(ROOT, pathname));

  if (!target.startsWith(ROOT) || target.startsWith(DATA_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(target, (error, bytes) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": MIME_TYPES[path.extname(target)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(bytes);
  });
}

function authenticate(email, password) {
  const users = readUsers();
  const user = users.find((item) => item.email.toLowerCase() === String(email || "").toLowerCase());
  if (!user || !password) return null;
  return verifyPassword(password, user.passwordHash) ? user : null;
}

function requireUser(req, res) {
  const token = getSessionToken(req);
  const session = token ? sessions.get(token) : null;
  if (!session) {
    sendJson(res, 401, { error: "Authentication required" });
    return null;
  }
  const user = readUsers().find((item) => item.id === session.userId);
  if (!user) {
    sendJson(res, 401, { error: "Authentication required" });
    return null;
  }
  return user;
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function cookieHeader(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, "HttpOnly", "SameSite=Lax", "Path=/"];
  if (Number.isFinite(options.maxAge)) parts.push(`Max-Age=${options.maxAge}`);
  return parts.join("; ");
}

function getSessionToken(req) {
  const cookie = req.headers.cookie || "";
  return cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("crm_session="))
    ?.split("=")[1];
}

function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

function readState() {
  if (!fs.existsSync(STATE_FILE)) return null;
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
}

function writeState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function stateForUser(state, user) {
  if (user.role === "agent") {
    return {
      ...state,
      currentUserId: user.accountId || "acct-agent"
    };
  }

  const allowedTransactions = state.transactions.filter((tx) => canAccessTransaction(state, user, tx));
  const guestAccount = {
    id: user.accountId || `acct-${user.id}`,
    name: user.name,
    email: user.email,
    role: user.role,
    label: `Guest ${user.role}`,
    transactionIds: allowedTransactions.map((tx) => tx.id)
  };

  return {
    ...state,
    currentUserId: guestAccount.id,
    accounts: [guestAccount],
    selectedId: allowedTransactions[0]?.id || null,
    transactions: allowedTransactions
  };
}

function canAccessTransaction(state, user, tx) {
  if (user.role === "agent") return true;
  const email = user.email.toLowerCase();
  const account = (state.accounts || []).find((item) => String(item.email || "").toLowerCase() === email);
  if ((account?.transactionIds || []).includes(tx.id)) return true;
  return [...(tx.buyers || []), ...(tx.sellers || [])].some((party) => String(party.email || "").toLowerCase() === email);
}

function publicUser(user) {
  return {
    id: user.id,
    accountId: user.accountId,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function ensureDevUsers() {
  if (fs.existsSync(USERS_FILE)) return;
  const users = [
    {
      id: "user-agent",
      accountId: "acct-agent",
      name: "Alex Champion",
      email: "agent@champion.local",
      role: "agent",
      password: "ChampionAgent!23"
    },
    {
      id: "user-maya",
      name: "Maya Chen",
      email: "maya.chen@example.com",
      role: "seller",
      password: "GuestSeller!23"
    },
    {
      id: "user-jordan",
      name: "Jordan Bell",
      email: "jordan.bell@example.com",
      role: "buyer",
      password: "GuestBuyer!23"
    },
    {
      id: "user-owen",
      name: "Owen Patel",
      email: "owen.patel@example.com",
      role: "buyer",
      password: "GuestBuyer!23"
    }
  ].map(({ password, ...user }) => ({
    ...user,
    passwordHash: hashPassword(password)
  }));

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

function verifyPassword(password, encoded) {
  const [scheme, salt, stored] = String(encoded || "").split(":");
  if (scheme !== "scrypt" || !salt || !stored) return false;
  const hash = crypto.scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(stored, "hex");
  return storedBuffer.length === hash.length && crypto.timingSafeEqual(storedBuffer, hash);
}

function roleLabel(role) {
  return {
    agent: "Agent",
    buyer: "Buyer",
    seller: "Seller"
  }[role] || role;
}
