const STORAGE_KEY = "champion-transaction-crm-v2";
const LEGACY_STORAGE_KEY = "champion-transaction-crm-v1";
const API_ENABLED = location.protocol === "http:" || location.protocol === "https:";
const API_BASE = API_ENABLED
  ? (window.CHAMPION_API_BASE || localStorage.getItem("champion-api-base") || "")
  : null;

const CURRENT_SOURCE_CHECK_DATE = "2026-06-19";

const SOURCES = {
  epaLead: {
    label: "EPA Lead-Based Paint Disclosure Rule",
    authority: "Federal",
    lastVerified: CURRENT_SOURCE_CHECK_DATE,
    url: "https://www.epa.gov/lead/real-estate-disclosures-about-potential-lead-hazards",
    summary:
      "Most pre-1978 housing sales require lead pamphlet delivery, known hazard disclosure, available records, contract warning language, a 10-day inspection option unless changed or waived, and record retention."
  },
  mdDisclosure: {
    label: "Maryland Real Property Section 10-702",
    authority: "Maryland",
    lastVerified: CURRENT_SOURCE_CHECK_DATE,
    url: "https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=grp&section=10-702&enactments=false",
    summary:
      "Maryland single-family residential sales generally use a State Real Estate Commission disclosure or disclaimer form on or before contract, with a late-delivery rescission window."
  },
  mdHoa: {
    label: "Maryland HOA Act Section 11B-106",
    authority: "Maryland",
    lastVerified: CURRENT_SOURCE_CHECK_DATE,
    url: "https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=grp&section=11B-106&enactments=false",
    summary:
      "Maryland HOA resale disclosures can be due at contract or within a statutory delivery period, with buyer cancellation windows when provided late or materially amended."
  },
  mdCondo: {
    label: "Maryland Condominium Act Section 11-135",
    authority: "Maryland",
    lastVerified: CURRENT_SOURCE_CHECK_DATE,
    url: "https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=grp&section=11-135&enactments=false",
    summary:
      "Maryland condominium resale package rules include certificate delivery mechanics and a purchaser rescission period after receipt of required information."
  },
  dcDisclosure: {
    label: "D.C. Code Section 42-1302",
    authority: "District of Columbia",
    lastVerified: CURRENT_SOURCE_CHECK_DATE,
    url: "https://code.dccouncil.gov/us/dc/council/code/sections/42-1302",
    summary:
      "D.C. seller disclosure statements are delivered before or at purchase agreement execution, with a 5-calendar-day termination right if disclosure is delivered late."
  },
  dcTopa: {
    label: "D.C. TOPA Sections 42-3404.02 and 42-3404.03",
    authority: "District of Columbia",
    lastVerified: CURRENT_SOURCE_CHECK_DATE,
    url: "https://code.dccouncil.gov/us/dc/council/code/sections/42-3404.03",
    summary:
      "Tenant-occupied D.C. housing can trigger offer-of-sale notices to tenants and the Mayor, delivery proof, and document request response deadlines."
  },
  dcCondo: {
    label: "D.C. Condominium Act Section 42-1904.11",
    authority: "District of Columbia",
    lastVerified: CURRENT_SOURCE_CHECK_DATE,
    url: "https://code.dccouncil.gov/us/dc/council/code/sections/42-1904.11",
    summary:
      "D.C. condo resales require the seller to obtain association materials and furnish them by the 10th business day after purchaser contract execution, with a review/cancellation window."
  },
  vaDisclosure: {
    label: "Virginia Residential Property Disclosure Act",
    authority: "Virginia",
    lastVerified: CURRENT_SOURCE_CHECK_DATE,
    url: "https://law.lis.virginia.gov/vacode/title55.1/chapter7/section55.1-709/",
    summary:
      "Virginia disclosure notification should be provided before ratification; if delivered afterward, purchaser termination windows can be 3 days for electronic/in-person delivery or 5 days after mail postmark, subject to earlier settlement, occupancy, loan application, or waiver events."
  },
  vaBuyerBeware: {
    label: "Virginia Code Section 55.1-703",
    authority: "Virginia",
    lastVerified: CURRENT_SOURCE_CHECK_DATE,
    url: "https://law.lis.virginia.gov/vacode/title55.1/chapter7/section55.1-703/",
    summary:
      "Virginia's disclosure statement emphasizes buyer due diligence on property condition, flood zones, radon zones, historic districts, Chesapeake Bay resource areas, easements, and other listed matters."
  },
  vaResale: {
    label: "Virginia Resale Disclosure Act",
    authority: "Virginia",
    lastVerified: CURRENT_SOURCE_CHECK_DATE,
    url: "https://law.lis.virginia.gov/vacodefull/title55.1/chapter23.1/",
    summary:
      "Virginia common-interest community resale certificates are requested from the association, typically delivered within 14 days, with purchaser cancellation rights tied to contract terms and certificate receipt."
  },
  googleCalendar: {
    label: "Google Calendar API events",
    authority: "Google Workspace",
    lastVerified: CURRENT_SOURCE_CHECK_DATE,
    url: "https://developers.google.com/calendar/api/guides/create-events",
    summary:
      "Calendar event creation should use OAuth-backed Calendar API events in production. This prototype creates a browser draft link until OAuth is added."
  },
  gmailSending: {
    label: "Gmail API sending",
    authority: "Google Workspace",
    lastVerified: CURRENT_SOURCE_CHECK_DATE,
    url: "https://developers.google.com/gmail/api/guides/sending",
    summary:
      "Automated Gmail sending requires OAuth, Gmail API message creation, and an appropriate sending scope such as gmail.send."
  },
  googleOAuthScopes: {
    label: "Google OAuth scopes",
    authority: "Google Workspace",
    lastVerified: CURRENT_SOURCE_CHECK_DATE,
    url: "https://developers.google.com/identity/protocols/oauth2/scopes",
    summary:
      "Google Workspace integrations should request the narrowest scopes possible and store refresh tokens server-side, not in this static browser app."
  },
  championBrand: {
    label: "Champion Operations website",
    authority: "Brand",
    lastVerified: CURRENT_SOURCE_CHECK_DATE,
    url: "https://www.championoperations.com",
    summary:
      "Brand cues used here include the black CO logo asset, Poppins/Manrope typography, square controls, a black/white foundation, and warm neutral accents."
  },
  dotloop: {
    label: "Dotloop product page",
    authority: "Market",
    lastVerified: CURRENT_SOURCE_CHECK_DATE,
    url: "https://www.dotloop.com/products/",
    summary:
      "Dotloop emphasizes transaction visibility, compliance, eSignatures, document editing/sharing, notifications, reporting, storage, task templates, and review workflows."
  },
  skyslope: {
    label: "SkySlope website",
    authority: "Market",
    lastVerified: CURRENT_SOURCE_CHECK_DATE,
    url: "https://www.skyslope.com/",
    summary:
      "SkySlope positions around AI-powered transactions, proactive compliance, smart checklists, automated auditing, analytics, forms, e-signing, and back-office accounting."
  },
  opentoclose: {
    label: "Open To Close website",
    authority: "Market",
    lastVerified: CURRENT_SOURCE_CHECK_DATE,
    url: "https://www.opentoclose.com/",
    summary:
      "Open To Close focuses on transaction tasks, emails, documents, dates, smart email templates, document tracking, portals, and buyer/seller task templates."
  },
  brokermint: {
    label: "Brokermint transaction management",
    authority: "Market",
    lastVerified: CURRENT_SOURCE_CHECK_DATE,
    url: "https://www.brokermint.com/transaction-management/",
    summary:
      "Brokermint is commonly positioned around transaction management, broker back office, commissions, documents, checklists, and reporting."
  }
};

const PHASES = ["Intake", "Disclosure", "Contingencies", "Closing"];
const JURISDICTIONS = ["MD", "DC", "VA"];
const STATUS_LABELS = {
  todo: "To Do",
  active: "Active",
  done: "Done",
  blocked: "Blocked"
};

const MESSAGE_TEMPLATES = {
  kickoff: {
    label: "Kickoff",
    subject: "Transaction kickoff and next steps",
    body:
      "Hi {{client}},\n\nI opened the transaction file for {{address}}. The timeline is organized by disclosure, contingency, financing, title, and closing workstreams.\n\nCurrent target closing: {{closingDate}}.\n\nI will keep replies in this thread so the full record stays tied to the transaction.\n\nThank you,"
  },
  disclosure: {
    label: "Disclosure reminder",
    subject: "Disclosure items needed for {{address}}",
    body:
      "Hi {{client}},\n\nThe next disclosure milestone for {{address}} is ready for review. Please send any completed forms, resale package materials, lead disclosures, association documents, or signed acknowledgements that apply to this transaction.\n\nI will log each item against the timeline as it is received.\n\nThank you,"
  },
  inspection: {
    label: "Inspection",
    subject: "Inspection and contingency tracking",
    body:
      "Hi {{client}},\n\nI am checking on the inspection and contingency items for {{address}}. Please reply with the inspection status, any repair requests, and whether any deadline extensions have been agreed to in writing.\n\nThank you,"
  },
  closing: {
    label: "Closing prep",
    subject: "Closing preparation for {{address}}",
    body:
      "Hi {{client}},\n\nWe are moving into closing preparation for {{address}}. Please confirm settlement time, final walkthrough timing, utility transfer plans, and whether any closing disclosure or settlement statement items need review.\n\nThank you,"
  },
  showing: {
    label: "Showing or walkthrough",
    subject: "Calendar event for {{address}}",
    body:
      "Hi {{client}},\n\nI am setting up a calendar event for {{address}}. Please confirm the proposed time, attendees, access notes, and any parking or building instructions.\n\nThank you,"
  }
};

const BUILT_IN_RULES = [
  {
    id: "agent-kickoff",
    title: "Open transaction file and confirm representation documents",
    phase: "Intake",
    owner: "Agent",
    daysFromContract: 0,
    priority: "High",
    note:
      "Create the internal record, confirm agency/representation documents, add lender, title, co-op agent, and client contacts.",
    sourceIds: []
  },
  {
    id: "earnest-money",
    title: "Track earnest money deposit receipt",
    phase: "Contingencies",
    owner: "Agent",
    daysFromContract: 3,
    priority: "High",
    note:
      "Default is 3 days after contract. Adjust to the actual contract language for each file.",
    sourceIds: []
  },
  {
    id: "title-order",
    title: "Open title order and settlement file",
    phase: "Closing",
    owner: "Agent",
    daysFromContract: 1,
    priority: "High",
    note:
      "Confirm settlement company, wiring instructions policy, payoff request path, and title contact.",
    sourceIds: []
  },
  {
    id: "inspection-window",
    title: "Manage home inspection contingency",
    phase: "Contingencies",
    owner: "Buyer",
    daysFromContract: 7,
    priority: "High",
    note:
      "Use 7 days as the starter deadline and replace with the signed contract's inspection period.",
    sourceIds: []
  },
  {
    id: "loan-application",
    title: "Confirm loan application and lender milestone plan",
    phase: "Contingencies",
    owner: "Buyer",
    daysFromContract: 7,
    priority: "High",
    condition: (tx) => tx.financing,
    note:
      "Track application, appraisal order, underwriting conditions, and financing contingency dates from the contract.",
    sourceIds: []
  },
  {
    id: "appraisal",
    title: "Confirm appraisal order and access",
    phase: "Contingencies",
    owner: "Agent",
    daysFromContract: 5,
    priority: "Medium",
    condition: (tx) => tx.financing,
    note:
      "Coordinate with listing side and lender. Escalate access issues because they compress underwriting time.",
    sourceIds: []
  },
  {
    id: "insurance",
    title: "Confirm homeowner insurance quote and binder path",
    phase: "Closing",
    owner: "Buyer",
    daysBeforeClosing: 14,
    priority: "Medium",
    note:
      "Flood, condo master policy, and lender requirements can affect timing. Keep binder evidence in the file.",
    sourceIds: []
  },
  {
    id: "settlement-statement",
    title: "Review settlement statement and closing funds",
    phase: "Closing",
    owner: "Agent",
    daysBeforeClosing: 3,
    priority: "High",
    note:
      "Confirm wire safety instructions through a trusted channel and keep closing cost questions in the transaction thread.",
    sourceIds: []
  },
  {
    id: "walkthrough",
    title: "Schedule final walkthrough",
    phase: "Closing",
    owner: "Buyer",
    daysBeforeClosing: 1,
    priority: "Medium",
    note:
      "Confirm repairs, inclusions, possession terms, and property condition before settlement.",
    sourceIds: []
  },
  {
    id: "close-record",
    title: "Record closing, key handoff, and post-close notes",
    phase: "Closing",
    owner: "Agent",
    daysBeforeClosing: 0,
    priority: "High",
    note:
      "Mark the file closed after settlement confirmation, recorded deed status if available, and final communication archive.",
    sourceIds: []
  },
  {
    id: "lead",
    title: "Complete federal lead-based paint disclosure and 10-day inspection option",
    phase: "Disclosure",
    owner: "Seller",
    daysFromContract: 0,
    priority: "High",
    condition: (tx) => Number(tx.builtYear) < 1978,
    note:
      "Applies to most pre-1978 housing unless exempt. Capture pamphlet delivery, known hazards, records/reports, warning statement, agent acknowledgement, and any written waiver or period change.",
    sourceIds: ["epaLead"]
  },
  {
    id: "lead-buyer",
    title: "Review lead-based paint disclosure and inspection election",
    phase: "Disclosure",
    owner: "Buyer",
    daysFromContract: 1,
    priority: "High",
    condition: (tx) => Number(tx.builtYear) < 1978,
    note:
      "For most pre-1978 housing, confirm receipt of the EPA pamphlet, disclosure statement, available reports, and the 10-day inspection period or written waiver/change.",
    sourceIds: ["epaLead"]
  },
  {
    id: "md-disclosure",
    title: "Maryland disclosure or disclaimer statement delivered and acknowledged",
    phase: "Disclosure",
    owner: "Seller",
    jurisdiction: "MD",
    daysFromContract: 0,
    priority: "High",
    note:
      "Maryland requires the State Real Estate Commission disclosure or disclaimer form on or before contract for covered single-family residential property. Late delivery can trigger a 5-day rescission window.",
    sourceIds: ["mdDisclosure"]
  },
  {
    id: "md-buyer-disclosure",
    title: "Review Maryland disclosure or disclaimer and preserve rescission clock",
    phase: "Disclosure",
    owner: "Buyer",
    jurisdiction: "MD",
    daysFromContract: 1,
    priority: "High",
    note:
      "Confirm receipt and signed acknowledgement. If the disclosure or disclaimer was not delivered on or before contract, track the buyer's 5-day post-receipt rescission window and any loan-application cutoff language.",
    sourceIds: ["mdDisclosure"]
  },
  {
    id: "md-hoa",
    title: "Maryland HOA resale disclosures requested and delivered",
    phase: "Disclosure",
    owner: "Seller",
    jurisdiction: "MD",
    daysFromContract: 2,
    priority: "High",
    condition: (tx) => ["townhome", "single-family"].includes(tx.propertyType),
    note:
      "When a Maryland HOA applies, request resale information immediately. Track statutory delivery timing and buyer cancellation windows if information is not timely received.",
    sourceIds: ["mdHoa"]
  },
  {
    id: "md-buyer-hoa",
    title: "Review Maryland HOA resale disclosures and cancellation dates",
    phase: "Disclosure",
    owner: "Buyer",
    jurisdiction: "MD",
    daysFromContract: 5,
    priority: "High",
    condition: (tx) => ["townhome", "single-family"].includes(tx.propertyType),
    note:
      "When the property is in a Maryland HOA, confirm receipt of the resale disclosures, fee changes, restrictions, and the buyer's cancellation deadline under the contract and MHAA notice.",
    sourceIds: ["mdHoa"]
  },
  {
    id: "md-condo",
    title: "Maryland condominium resale certificate and package",
    phase: "Disclosure",
    owner: "Seller",
    jurisdiction: "MD",
    daysFromContract: 2,
    priority: "High",
    condition: (tx) => tx.propertyType === "condo",
    note:
      "Request the condominium certificate quickly. Maryland law includes council response timing and a purchaser rescission period after receipt of all required resale information.",
    sourceIds: ["mdCondo"]
  },
  {
    id: "md-buyer-condo",
    title: "Review Maryland condo resale certificate and rescission period",
    phase: "Disclosure",
    owner: "Buyer",
    jurisdiction: "MD",
    daysFromContract: 5,
    priority: "High",
    condition: (tx) => tx.propertyType === "condo",
    note:
      "Check association fees, reserves, insurance, litigation, rules, and the purchaser's resale package review/cancellation period after receipt.",
    sourceIds: ["mdCondo"]
  },
  {
    id: "dc-disclosure",
    title: "D.C. seller disclosure statement delivered before or at contract",
    phase: "Disclosure",
    owner: "Seller",
    jurisdiction: "DC",
    daysFromContract: 0,
    priority: "High",
    note:
      "For covered D.C. residential transfers, disclosure is due before or at purchase agreement execution. Late disclosure can give the purchaser 5 calendar days to terminate.",
    sourceIds: ["dcDisclosure"]
  },
  {
    id: "dc-buyer-disclosure",
    title: "Review D.C. seller disclosure and late-delivery termination date",
    phase: "Disclosure",
    owner: "Buyer",
    jurisdiction: "DC",
    daysFromContract: 1,
    priority: "High",
    note:
      "Confirm the D.C. disclosure statement was delivered before or at purchase agreement execution. If delivered late, track the 5-calendar-day termination window and financing cutoff events.",
    sourceIds: ["dcDisclosure"]
  },
  {
    id: "dc-topa",
    title: "D.C. TOPA status, offer-of-sale notice, and delivery proof",
    phase: "Disclosure",
    owner: "Seller",
    jurisdiction: "DC",
    daysFromContract: -5,
    priority: "High",
    condition: (tx) => tx.tenantOccupied,
    note:
      "Tenant-occupied D.C. properties can require TOPA review before sale steps continue. Capture notices to tenants and the Mayor, delivery method, and document request response dates.",
    sourceIds: ["dcTopa"]
  },
  {
    id: "dc-buyer-topa",
    title: "Confirm D.C. TOPA compliance status before closing",
    phase: "Disclosure",
    owner: "Buyer",
    jurisdiction: "DC",
    daysFromContract: 2,
    priority: "High",
    condition: (tx) => tx.tenantOccupied,
    note:
      "For tenant-occupied D.C. property, confirm with counsel/title whether TOPA applies, whether notices were issued, and whether any tenant rights or response periods remain open.",
    sourceIds: ["dcTopa"]
  },
  {
    id: "dc-condo",
    title: "D.C. condominium instruments and association certificate",
    phase: "Disclosure",
    owner: "Seller",
    jurisdiction: "DC",
    daysFromContract: 2,
    priority: "High",
    condition: (tx) => tx.propertyType === "condo",
    note:
      "D.C. condo resale materials are due on or before the 10th business day after purchaser execution, with a 3-business-day review/cancellation period after receipt.",
    sourceIds: ["dcCondo"]
  },
  {
    id: "dc-buyer-condo",
    title: "Review D.C. condo instruments and 3-business-day cancellation period",
    phase: "Disclosure",
    owner: "Buyer",
    jurisdiction: "DC",
    daysFromContract: 5,
    priority: "High",
    condition: (tx) => tx.propertyType === "condo",
    note:
      "Confirm receipt of the condominium instruments and association certificate, then track the 3-business-day review/cancellation period and any extension in writing.",
    sourceIds: ["dcCondo"]
  },
  {
    id: "va-disclosure",
    title: "Virginia residential property disclosure notification delivered",
    phase: "Disclosure",
    owner: "Seller",
    jurisdiction: "VA",
    daysFromContract: 0,
    priority: "High",
    note:
      "Virginia disclosure notification should be delivered before ratification. If late, track the statutory termination clock based on delivery method and earlier cutoff events.",
    sourceIds: ["vaDisclosure", "vaBuyerBeware"]
  },
  {
    id: "va-buyer-disclosure",
    title: "Review Virginia disclosure notification and termination window",
    phase: "Disclosure",
    owner: "Buyer",
    jurisdiction: "VA",
    daysFromContract: 1,
    priority: "High",
    note:
      "Confirm disclosure notification was provided before ratification. If late, track the 3-day electronic/in-person or 5-day mail termination period and any earlier cutoff events.",
    sourceIds: ["vaDisclosure", "vaBuyerBeware"]
  },
  {
    id: "va-resale",
    title: "Virginia common-interest resale certificate requested",
    phase: "Disclosure",
    owner: "Seller",
    jurisdiction: "VA",
    daysFromContract: 1,
    priority: "High",
    condition: (tx) => ["condo", "townhome"].includes(tx.propertyType),
    note:
      "For Virginia common-interest communities, request the resale certificate immediately. The association delivery benchmark is 14 days, and cancellation rights depend on certificate receipt and contract terms.",
    sourceIds: ["vaResale"]
  },
  {
    id: "va-buyer-resale",
    title: "Review Virginia resale certificate and cancellation period",
    phase: "Disclosure",
    owner: "Buyer",
    jurisdiction: "VA",
    daysFromContract: 5,
    priority: "High",
    condition: (tx) => ["condo", "townhome"].includes(tx.propertyType),
    note:
      "Review the resale certificate, fees, violations, reserves, restrictions, and the contract's cancellation period after receipt. If no period is specified, the source rule provides a 3-day default.",
    sourceIds: ["vaResale"]
  },
  {
    id: "va-due-diligence",
    title: "Virginia buyer due diligence review",
    phase: "Contingencies",
    owner: "Buyer",
    jurisdiction: "VA",
    daysFromContract: 7,
    priority: "High",
    note:
      "Review flood risk, radon zone, Chesapeake Bay resource areas, historic district rules, easements, adjacent parcel use, and other buyer-beware items before settlement.",
    sourceIds: ["vaBuyerBeware"]
  }
];

const AUDIT_CHECKS = [
  {
    id: "federal-lead",
    label: "Federal lead disclosure workflow",
    requiredRuleIds: ["lead", "lead-buyer"],
    sourceIds: ["epaLead"],
    note: "Seller and buyer milestones should both exist for most pre-1978 housing."
  },
  {
    id: "md-disclosure",
    label: "Maryland disclosure or disclaimer",
    requiredRuleIds: ["md-disclosure", "md-buyer-disclosure"],
    sourceIds: ["mdDisclosure"],
    note: "Maryland seller delivery and buyer rescission review are both tracked."
  },
  {
    id: "md-association",
    label: "Maryland HOA and condo resale packages",
    requiredRuleIds: ["md-hoa", "md-buyer-hoa", "md-condo", "md-buyer-condo"],
    sourceIds: ["mdHoa", "mdCondo"],
    note: "Association package requests and buyer review windows are tracked separately."
  },
  {
    id: "dc-disclosure",
    label: "D.C. seller disclosure",
    requiredRuleIds: ["dc-disclosure", "dc-buyer-disclosure"],
    sourceIds: ["dcDisclosure"],
    note: "D.C. late-delivery termination timing is represented for buyer review."
  },
  {
    id: "dc-topa",
    label: "D.C. TOPA status",
    requiredRuleIds: ["dc-topa", "dc-buyer-topa"],
    sourceIds: ["dcTopa"],
    note: "Tenant-occupied D.C. files should keep TOPA notice and buyer compliance checks visible."
  },
  {
    id: "dc-condo",
    label: "D.C. condo resale materials",
    requiredRuleIds: ["dc-condo", "dc-buyer-condo"],
    sourceIds: ["dcCondo"],
    note: "Condo instrument delivery and buyer review timing are tracked."
  },
  {
    id: "va-disclosure",
    label: "Virginia disclosure and buyer-beware review",
    requiredRuleIds: ["va-disclosure", "va-buyer-disclosure", "va-due-diligence"],
    sourceIds: ["vaDisclosure", "vaBuyerBeware"],
    note: "Virginia disclosure timing and due-diligence prompts are represented."
  },
  {
    id: "va-resale",
    label: "Virginia common-interest resale certificate",
    requiredRuleIds: ["va-resale", "va-buyer-resale"],
    sourceIds: ["vaResale"],
    note: "Common-interest resale request and buyer review milestones are tracked."
  }
];

const MARKET_COMPARISON = [
  {
    name: "Dotloop",
    sourceId: "dotloop",
    focus: "Broad transaction collaboration, eSignatures, document editing, compliance, reporting, storage, mobile access, task templates, and review workflows.",
    gapForChampion:
      "Strong all-in-one coverage, but not specialized around MD/DC/VA statutory timeline auditing or a concierge-style buyer/seller progress portal."
  },
  {
    name: "SkySlope",
    sourceId: "skyslope",
    focus: "Brokerage-scale transaction management with smart checklists, automated auditing, analytics, forms, signing, and back-office accounting.",
    gapForChampion:
      "Enterprise compliance depth is a strength; Champion can differentiate with regional legal-rule transparency, smaller-team setup speed, and client-facing clarity."
  },
  {
    name: "Open To Close",
    sourceId: "opentoclose",
    focus: "Task, email, document, and date organization with smart email templates, portals, and customizable buyer/seller-side task templates.",
    gapForChampion:
      "Closest to the transaction-coordination workflow. Champion can stand apart with explicit legal-source auditing, multi-buyer status changes, and local DMV rules."
  },
  {
    name: "Brokermint",
    sourceId: "brokermint",
    focus: "Broker back-office transaction tracking, checklists, document handling, reporting, and commission/accounting workflows.",
    gapForChampion:
      "Useful for brokerage operations; less focused on guest-facing progress transparency, jurisdiction-specific rule notes, and property-level media/map context."
  }
];

const CHAMPION_DIFFERENTIATORS = [
  "MD/DC/VA timeline templates with legal source links and audit notes.",
  "Guest buyer/seller portals that show only their transaction progress and allow comments.",
  "Multiple buyer candidates per transaction with active, backup, and removed states.",
  "Property snapshot panel with listing photo, virtual tour link, and map embed beside workflow status.",
  "Google Calendar/Gmail draft workflows that can later become OAuth-backed automation.",
  "Low-cost local backend now, with a clear path to Postgres, real auth, and rule-versioned compliance."
];

let backendSession = null;
let backendStateLoaded = false;
let backendSyncTimer = null;
let backendSyncInFlight = false;
let csrfToken = null;
let backendMode = "spring";
let guestTimelineState = null;
let state;
state = loadState();

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return upgradeState(JSON.parse(saved));
    } catch (error) {
      console.warn("Failed to parse saved CRM data", error);
    }
  }

  const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (legacy) {
    try {
      return upgradeState(JSON.parse(legacy));
    } catch (error) {
      console.warn("Failed to parse legacy CRM data", error);
    }
  }

  return seedState();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  queueBackendSync();
}

function queueBackendSync() {
  if (backendMode !== "legacy-state") return;
  if (!backendSession || !backendStateLoaded || backendSyncInFlight || !isAgent()) return;
  clearTimeout(backendSyncTimer);
  backendSyncTimer = setTimeout(() => {
    pushBackendState().catch((error) => console.warn("Backend sync failed", error));
  }, 350);
}

async function pushBackendState() {
  if (!backendSession || !isAgent()) return;
  backendSyncInFlight = true;
  try {
    await apiFetch("/api/state", {
      method: "PUT",
      body: JSON.stringify({ state })
    });
  } finally {
    backendSyncInFlight = false;
  }
}

async function bootstrapApp() {
  if (!API_ENABLED) {
    state.view = "login";
    render();
    return;
  }

  const guestToken = guestTokenFromLocation();
  if (guestToken) {
    await loadGuestTimeline(guestToken);
    render();
    return;
  }

  try {
    backendSession = await fetchBackendSession();
    try {
      await hydrateFromBackend();
    } catch (error) {
      backendStateLoaded = false;
      console.warn("Backend state hydration unavailable", error);
    }
    render();
  } catch (error) {
    backendSession = null;
    backendStateLoaded = false;
    state.view = "login";
    render();
  }
}

async function hydrateFromBackend() {
  try {
    const payload = await apiFetch("/api/state");
    backendMode = "legacy-state";
    backendSession = normalizeBackendSession({ user: payload.user });
    if (payload.state) {
      state = upgradeState(payload.state);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else if (backendSession.user.role === "agent" || backendSession.user.role === "admin") {
      await pushBackendState();
    } else {
      state = emptyGuestState(backendSession.user);
    }
  } catch (error) {
    backendMode = "spring";
    state = await loadSpringState(backendSession.user);
  }
  backendStateLoaded = true;
}

async function loadSpringState(user) {
  const summaries = await apiFetch("/api/transactions");
  const details = await Promise.all(
    summaries.map((summary) => apiFetch(`/api/transactions/${encodeURIComponent(summary.id)}`))
  );
  const transactions = details.map(mapSpringTransactionDetail);
  const isStaffAccount = user.role === "agent" || user.role === "admin";
  const leads = isStaffAccount ? (await apiFetch("/api/leads")).map(mapSpringLead) : [];
  const users = isStaffAccount ? (await apiFetch("/api/users")).map(mapSpringUser) : [];
  return {
    selectedId: transactions[0]?.id || null,
    view: "dashboard",
    taskFilter: "all",
    search: "",
    currentUserId: user.accountId || `acct-${user.id}`,
    accounts: [
      {
        id: user.accountId || `acct-${user.id}`,
        name: user.name,
        email: user.email,
        role: user.role,
        label: roleLabel(user.role),
        transactionIds: transactions.map((tx) => tx.id)
      }
    ],
    customRules: [],
    auditRuns: [],
    integrations: defaultIntegrations(),
    leads,
    users,
    transactions
  };
}

function mapSpringUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.displayName,
    role: String(user.role || "").toLowerCase(),
    enabled: user.enabled !== false
  };
}

function mapSpringLead(lead) {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email || "",
    phone: lead.phone || "",
    source: lead.source || "",
    leadType: String(lead.leadType || "OTHER").toLowerCase(),
    status: String(lead.status || "NEW").toLowerCase(),
    propertyAddress: lead.propertyAddress || "",
    jurisdiction: lead.jurisdiction || "",
    notes: lead.notes || "",
    createdBy: lead.createdBy || "",
    airtableRecordId: lead.airtableRecordId || "",
    airtableSyncStatus: String(lead.airtableSyncStatus || "NOT_CONFIGURED").toLowerCase(),
    makeDeliveryStatus: String(lead.makeDeliveryStatus || "NOT_CONFIGURED").toLowerCase(),
    lastIntegrationError: lead.lastIntegrationError || "",
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt
  };
}

function mapSpringTransactionDetail(detail) {
  const summary = detail.transaction;
  const role = workflowRoleToLocalRole(summary.workflowRole);
  const parties = detail.parties || [];
  const tx = normalizeTransaction({
    id: summary.id,
    code: summary.code,
    address: summary.address,
    client: summary.clientName,
    contactEmail: "",
    jurisdiction: summary.jurisdiction,
    role,
    propertyType: summary.propertyType || "single-family",
    stage: summary.stage,
    contractDate: summary.contractDate || new Date().toISOString().slice(0, 10),
    closingDate: summary.closingDate || new Date().toISOString().slice(0, 10),
    builtYear: summary.builtYear || 1980,
    price: summary.price || 0,
    guestToken: summary.guestToken || "",
    photoUrl: summary.photoUrl || "",
    tourUrl: summary.virtualTourUrl || "",
    tenantOccupied: false,
    financing: true,
    sellers: parties.filter((party) => party.partyType === "SELLER").map(mapSpringParty),
    buyers: parties.filter((party) => party.partyType === "BUYER").map(mapSpringParty),
    messages: (detail.messages || []).map(mapSpringMessage)
  });
  tx.tasks = mergeGeneratedTasks(tx, tx.tasks);
  return tx;
}

function mapSpringParty(party) {
  return {
    id: party.id,
    name: party.name,
    email: party.email || "",
    status: String(party.status || "ACTIVE").toLowerCase()
  };
}

function mapSpringMessage(message) {
  return {
    id: message.id,
    channel: message.channel,
    direction: message.channel === "email" ? "outbound" : "internal",
    visibility: message.visibility,
    status: "logged",
    author: message.authorName,
    subject: message.subject,
    to: "Transaction team",
    createdAt: message.createdAt,
    body: message.body,
    relatedTaskId: null
  };
}

function workflowRoleToLocalRole(role) {
  return String(role || "AGENT").toLowerCase();
}

function emptyGuestState(user) {
  return {
    selectedId: null,
    view: "dashboard",
    taskFilter: "all",
    search: "",
    currentUserId: user.accountId || `acct-${user.id}`,
    accounts: [
      {
        id: user.accountId || `acct-${user.id}`,
        name: user.name,
        email: user.email,
        role: user.role,
        label: `Guest ${user.role}`,
        transactionIds: []
      }
    ],
    customRules: [],
    auditRuns: [],
    integrations: defaultIntegrations(),
    leads: [],
    users: [],
    transactions: []
  };
}

function guestTokenFromLocation() {
  const params = new URLSearchParams(window.location.search);
  return params.get("guest") || params.get("timeline") || "";
}

async function loadGuestTimeline(token) {
  backendSession = null;
  backendStateLoaded = false;
  csrfToken = null;
  const payload = await apiFetch(`/api/guest/timeline/${encodeURIComponent(token)}`);
  const tx = mapGuestTimeline(payload);
  state = {
    selectedId: tx.id,
    view: "guestTimeline",
    taskFilter: "all",
    search: "",
    currentUserId: "guest-url",
    accounts: [
      {
        id: "guest-url",
        name: "Guest Viewer",
        email: "",
        role: "viewer",
        label: "Guest viewer",
        transactionIds: [tx.id]
      }
    ],
    customRules: [],
    auditRuns: [],
    integrations: defaultIntegrations(),
    transactions: [tx]
  };
  guestTimelineState = { transaction: tx };
}

function mapGuestTimeline(payload) {
  const summary = payload.transaction;
  const tx = normalizeTransaction({
    id: summary.id,
    code: summary.code,
    address: summary.address,
    client: summary.clientName,
    contactEmail: "",
    jurisdiction: summary.jurisdiction,
    role: workflowRoleToLocalRole(summary.workflowRole),
    propertyType: summary.propertyType || "single-family",
    stage: summary.stage,
    contractDate: summary.contractDate || new Date().toISOString().slice(0, 10),
    closingDate: summary.closingDate || new Date().toISOString().slice(0, 10),
    builtYear: summary.builtYear || 1980,
    price: summary.price || 0,
    photoUrl: summary.photoUrl || "",
    tourUrl: summary.virtualTourUrl || "",
    tenantOccupied: false,
    financing: true,
    sellers: [],
    buyers: [],
    messages: []
  });
  tx.tasks = (payload.tasks || []).map((task) => ({
    id: task.id,
    title: task.title,
    phase: task.phase,
    owner: task.owner,
    dueDate: task.dueDate,
    status: task.status,
    priority: task.priority,
    note: task.note,
    sourceIds: [],
    sourceUrl: task.sourceUrl || ""
  }));
  return tx;
}

async function loginToBackend(formData) {
  const errorNode = document.querySelector("#loginError");
  try {
    csrfToken = null;
    backendSession = normalizeBackendSession(await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password")
      })
    }));
    try {
      await hydrateFromBackend();
    } catch (error) {
      backendStateLoaded = false;
      console.warn("Backend state hydration unavailable", error);
    }
    state.view = "dashboard";
    render();
  } catch (error) {
    if (errorNode) errorNode.textContent = error.message || "Login failed.";
  }
}

function showAuthPanel(panelId) {
  document.querySelectorAll(".auth-panel").forEach((panel) => {
    panel.hidden = panel.id !== panelId || !panel.hidden;
  });
  const status = document.querySelector("#authPromptStatus");
  if (status) status.textContent = "";
}

async function requestAccount(formData) {
  const status = document.querySelector("#authPromptStatus");
  try {
    const payload = await apiFetch("/api/auth/account-requests", {
      method: "POST",
      body: JSON.stringify({
        displayName: formData.get("displayName"),
        email: formData.get("email"),
        requestedRole: formData.get("requestedRole")
      })
    });
    if (status) status.textContent = payload.message || "Account request received.";
  } catch (error) {
    if (status) status.textContent = error.message || "Account request failed.";
  }
}

async function requestPasswordReset(formData) {
  const status = document.querySelector("#authPromptStatus");
  try {
    const payload = await apiFetch("/api/auth/password-reset/request", {
      method: "POST",
      body: JSON.stringify({ email: formData.get("email") })
    });
    if (status) status.textContent = payload.message || "Password reset request received.";
  } catch (error) {
    if (status) status.textContent = error.message || "Password reset request failed.";
  }
}

function openGuestTimelineFromForm(formData) {
  const raw = String(formData.get("guestLink") || "").trim();
  const token = extractGuestToken(raw);
  const status = document.querySelector("#authPromptStatus");
  if (!token) {
    if (status) status.textContent = "Enter a valid guest timeline link or access code.";
    return;
  }
  window.location.href = `${window.location.origin}${window.location.pathname}?guest=${encodeURIComponent(token)}`;
}

function extractGuestToken(value) {
  if (!value) return "";
  try {
    const parsed = new URL(value);
    return parsed.searchParams.get("guest") || parsed.searchParams.get("timeline") || parsed.pathname.split("/").filter(Boolean).pop() || "";
  } catch (error) {
    return value.replace(/^guest:/i, "").trim();
  }
}

async function logoutFromBackend() {
  if (API_ENABLED && backendSession) {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.warn("Logout failed", error);
    }
  }
  backendSession = null;
  backendStateLoaded = false;
  csrfToken = null;
  if (API_ENABLED) {
    state.view = "login";
  }
  render();
}

function normalizeBackendSession(payload) {
  if (!payload) return null;
  const user = payload.user || payload;
  const normalizedRole = String(user.role || "guest").toLowerCase();
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name || user.displayName || user.email,
      role: normalizedRole
    }
  };
}

async function fetchBackendSession() {
  try {
    return normalizeBackendSession(await apiFetch("/api/auth/session"));
  } catch (error) {
    return normalizeBackendSession(await apiFetch("/api/session"));
  }
}

async function apiFetch(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (!["GET", "HEAD", "OPTIONS"].includes(method) && !headers["X-XSRF-TOKEN"]) {
    const token = await getCsrfToken().catch(() => null);
    if (token) headers["X-XSRF-TOKEN"] = token;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    credentials: API_BASE ? "include" : "same-origin",
    ...options,
    headers
  });
  const text = await response.text();
  let payload = {};
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch (parseError) {
      const contentType = response.headers.get("content-type") || "";
      if (!response.ok) {
        throw new Error(
          response.status >= 500
            ? `The Spring server could not be reached (HTTP ${response.status}). Keep the app and cloudflared running, then try again.`
            : `The server returned an unexpected response (HTTP ${response.status}).`
        );
      }
      throw new Error(
        contentType.includes("text/html")
          ? "The shared link returned a web page instead of an API response. Confirm the tunnel points to http://localhost:8080."
          : "The server returned an unreadable response. Please try again."
      );
    }
  }
  if (!response.ok) {
    throw new Error(payload.error || payload.message || payload.detail || `Request failed with ${response.status}`);
  }
  return payload;
}

async function getCsrfToken() {
  if (csrfToken) return csrfToken;
  const response = await fetch(`${API_BASE}/api/auth/csrf`, {
    credentials: API_BASE ? "include" : "same-origin",
    headers: { "Content-Type": "application/json" }
  });
  if (!response.ok) return null;
  const payload = await response.json();
  csrfToken = payload.token;
  return csrfToken;
}

function upgradeState(saved) {
  const upgraded = {
    selectedId: saved.selectedId,
    view: saved.view || "dashboard",
    taskFilter: saved.taskFilter || "all",
    search: saved.search || "",
    currentUserId: saved.currentUserId || "acct-agent",
    accounts: saved.accounts || [],
    customRules: saved.customRules || [],
    auditRuns: saved.auditRuns || [],
    integrations: saved.integrations || defaultIntegrations(),
    leads: saved.leads || [],
    users: saved.users || [],
    transactions: (saved.transactions || []).map((tx) => normalizeTransaction(tx))
  };

  if (!upgraded.transactions.length) return seedState();
  if (!upgraded.accounts.length) upgraded.accounts = defaultAccounts(upgraded.transactions);
  upgraded.transactions.forEach((tx) => {
    tx.tasks = mergeGeneratedTasks(tx, tx.tasks || []);
  });
  if (!upgraded.transactions.some((tx) => tx.id === upgraded.selectedId)) {
    upgraded.selectedId = upgraded.transactions[0].id;
  }
  return upgraded;
}

function seedState() {
  const transactions = [
    createTransaction({
      address: "7421 Willow Ridge Dr, Bethesda, MD",
      client: "Maya Chen",
      contactEmail: "maya.chen@example.com",
      jurisdiction: "MD",
      role: "seller",
      propertyType: "townhome",
      stage: "Contingencies",
      contractDate: "2026-06-13",
      closingDate: "2026-07-22",
      builtYear: 1972,
      price: 715000,
      photoUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
      tenantOccupied: false,
      financing: true,
      sellers: [{ id: makeId("seller"), name: "Maya Chen", email: "maya.chen@example.com", status: "active" }],
      buyers: [
        { id: makeId("buyer"), name: "Owen Patel", email: "owen.patel@example.com", status: "active" },
        { id: makeId("buyer"), name: "Renee Cole", email: "renee.cole@example.com", status: "backup" }
      ]
    }),
    createTransaction({
      address: "1810 Kalorama Rd NW, Washington, DC",
      client: "Jordan Bell",
      contactEmail: "jordan.bell@example.com",
      jurisdiction: "DC",
      role: "buyer",
      propertyType: "condo",
      stage: "Under Contract",
      contractDate: "2026-06-17",
      closingDate: "2026-07-18",
      builtYear: 1928,
      price: 645000,
      photoUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      tenantOccupied: false,
      financing: true,
      sellers: [{ id: makeId("seller"), name: "Listing Seller", email: "seller@example.com", status: "active" }],
      buyers: [{ id: makeId("buyer"), name: "Jordan Bell", email: "jordan.bell@example.com", status: "active" }]
    }),
    createTransaction({
      address: "906 N Highland St, Arlington, VA",
      client: "Priya Nair",
      contactEmail: "priya.nair@example.com",
      jurisdiction: "VA",
      role: "agent",
      propertyType: "condo",
      stage: "Settlement Prep",
      contractDate: "2026-06-05",
      closingDate: "2026-06-28",
      builtYear: 2004,
      price: 585000,
      photoUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      tenantOccupied: false,
      financing: true,
      sellers: [{ id: makeId("seller"), name: "Priya Nair", email: "priya.nair@example.com", status: "active" }],
      buyers: [{ id: makeId("buyer"), name: "Marcus Reed", email: "marcus.reed@example.com", status: "active" }]
    })
  ];

  const seeded = {
    selectedId: transactions[0].id,
    view: "dashboard",
    taskFilter: "all",
    search: "",
    currentUserId: "acct-agent",
    accounts: defaultAccounts(transactions),
    customRules: [
      {
        id: "custom-smoke-co",
        title: "Confirm local smoke and carbon monoxide requirements",
        phase: "Closing",
        owner: "Agent",
        jurisdiction: "All",
        basis: "closing",
        days: 10,
        priority: "Medium",
        propertyType: "all",
        note:
          "Starter custom rule for local municipal or county compliance items. Replace with jurisdiction-specific brokerage guidance.",
        sourceUrl: "",
        createdAt: new Date().toISOString()
      }
    ],
    auditRuns: [],
    integrations: defaultIntegrations(),
    leads: [],
    users: [],
    transactions
  };

  seeded.transactions.forEach((tx) => {
    tx.tasks = mergeGeneratedTasks(tx, tx.tasks);
  });
  return seeded;
}

function defaultIntegrations() {
  return {
    googleCalendar: {
      mode: "draft",
      status: "Not connected",
      calendarId: "primary",
      sourceId: "googleCalendar"
    },
    gmail: {
      mode: "draft",
      status: "Not connected",
      senderEmail: "agent@yourdomain.com",
      sourceId: "gmailSending"
    },
    automation: {
      createCalendarDrafts: true,
      logEmailPreviews: true
    }
  };
}

function defaultAccounts(transactions) {
  const accounts = [
    {
      id: "acct-agent",
      name: "Alex Champion",
      email: "agent@champion.local",
      role: "agent",
      label: "Agent",
      transactionIds: transactions.map((tx) => tx.id)
    }
  ];

  transactions.forEach((tx) => {
    tx.sellers.forEach((seller) => {
      accounts.push({
        id: `acct-${seller.id}`,
        name: seller.name,
        email: seller.email,
        role: "seller",
        label: "Guest seller",
        transactionIds: [tx.id]
      });
    });
    activeBuyers(tx).forEach((buyer) => {
      accounts.push({
        id: `acct-${buyer.id}`,
        name: buyer.name,
        email: buyer.email,
        role: "buyer",
        label: "Guest buyer",
        transactionIds: [tx.id]
      });
    });
  });

  return dedupeAccounts(accounts);
}

function createTransaction(input) {
  const tx = normalizeTransaction({
    id: input.id || makeId("tx"),
    code: input.code || makeCode(input.jurisdiction),
    address: input.address,
    client: input.client,
    contactEmail: input.contactEmail || "",
    jurisdiction: input.jurisdiction,
    role: input.role,
    propertyType: input.propertyType,
    stage: input.stage,
    contractDate: input.contractDate,
    closingDate: input.closingDate,
    builtYear: Number(input.builtYear),
    price: Number(input.price || 0),
    tenantOccupied: Boolean(input.tenantOccupied),
    financing: Boolean(input.financing),
    media: {
      photoUrl: input.photoUrl || input.media?.photoUrl || "",
      tourUrl: input.tourUrl || input.media?.tourUrl || ""
    },
    createdAt: new Date().toISOString(),
    sellers: input.sellers,
    buyers: input.buyers,
    messages: []
  });

  tx.tasks = generateTasks(tx);
  tx.messages = [
    {
      id: makeId("msg"),
      channel: "email",
      direction: "outbound",
      visibility: "client",
      status: "logged",
      author: "System",
      subject: `[${tx.code}] Transaction kickoff and next steps`,
      to: primaryRecipient(tx),
      createdAt: tx.createdAt,
      body: fillTemplate(MESSAGE_TEMPLATES.kickoff.body, tx),
      relatedTaskId: "agent-kickoff"
    }
  ];

  markSeedProgress(tx);
  return tx;
}

function normalizeTransaction(tx) {
  const sellers = Array.isArray(tx.sellers) && tx.sellers.length
    ? tx.sellers
    : tx.role === "seller"
      ? [{ id: makeId("seller"), name: tx.client || "Seller", email: tx.contactEmail || "", status: "active" }]
      : [{ id: makeId("seller"), name: "Seller", email: "", status: "active" }];

  const buyers = Array.isArray(tx.buyers) && tx.buyers.length
    ? tx.buyers
    : tx.role === "buyer"
      ? [{ id: makeId("buyer"), name: tx.client || "Buyer", email: tx.contactEmail || "", status: "active" }]
      : [];

  return {
    ...tx,
    id: tx.id || makeId("tx"),
    code: tx.code || makeCode(tx.jurisdiction || "TX"),
    client: tx.client || sellers[0]?.name || buyers[0]?.name || "Client",
    contactEmail: tx.contactEmail || sellers[0]?.email || buyers[0]?.email || "",
    jurisdiction: tx.jurisdiction || "MD",
    role: tx.role || "agent",
    propertyType: tx.propertyType || "single-family",
    stage: tx.stage || "Intake",
    builtYear: Number(tx.builtYear || 1980),
    price: Number(tx.price || 0),
    tenantOccupied: Boolean(tx.tenantOccupied),
    financing: tx.financing !== false,
    media: {
      photoUrl: tx.media?.photoUrl || tx.photoUrl || "",
      tourUrl: tx.media?.tourUrl || tx.tourUrl || ""
    },
    createdAt: tx.createdAt || new Date().toISOString(),
    sellers: sellers.map(normalizeParty),
    buyers: buyers.map(normalizeParty),
    messages: (tx.messages || []).map(normalizeMessage),
    tasks: tx.tasks || []
  };
}

function normalizeParty(party) {
  return {
    id: party.id || makeId("party"),
    name: party.name || "Unnamed",
    email: party.email || "",
    status: party.status || "active"
  };
}

function normalizeMessage(message) {
  return {
    id: message.id || makeId("msg"),
    channel: message.channel || "email",
    direction: message.direction || "outbound",
    visibility: message.visibility || "client",
    status: message.status || "logged",
    author: message.author || "System",
    subject: message.subject || "Transaction note",
    to: message.to || "",
    createdAt: message.createdAt || new Date().toISOString(),
    body: message.body || "",
    relatedTaskId: message.relatedTaskId || null
  };
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function makeCode(jurisdiction) {
  const stamp = new Date().toISOString().slice(2, 10).replaceAll("-", "");
  return `${jurisdiction}-${stamp}-${Math.floor(100 + Math.random() * 900)}`;
}

function allRules() {
  return [
    ...BUILT_IN_RULES,
    ...(state?.customRules || []).map((rule) => ({
      ...rule,
      jurisdiction: rule.jurisdiction === "All" ? undefined : rule.jurisdiction,
      daysFromContract: rule.basis === "contract" ? Number(rule.days || 0) : undefined,
      daysBeforeClosing: rule.basis === "closing" ? Number(rule.days || 0) : undefined,
      sourceIds: []
    }))
  ];
}

function generateTasks(tx) {
  return allRules()
    .filter((template) => ruleAppliesToTransaction(template, tx))
    .map((template) => ({
      id: template.id,
      title: template.title,
      phase: template.phase,
      owner: template.owner,
      status: taskDefaultStatus(template, tx),
      priority: template.priority,
      dueDate: calculateDueDate(template, tx),
      note: template.note,
      sourceIds: template.sourceIds || [],
      sourceUrl: template.sourceUrl || ""
    }))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}

function mergeGeneratedTasks(tx, existingTasks) {
  const existing = new Map((existingTasks || []).map((task) => [task.id, task]));
  return generateTasks(tx).map((task) => {
    const old = existing.get(task.id);
    return old ? { ...task, status: old.status || task.status } : task;
  });
}

function ruleAppliesToTransaction(template, tx) {
  if (template.jurisdiction && template.jurisdiction !== tx.jurisdiction) return false;
  if (template.propertyType && template.propertyType !== "all" && template.propertyType !== tx.propertyType) return false;
  if (template.condition && !template.condition(tx)) return false;
  return ownerMatchesRole(template.owner, tx.role);
}

function ownerMatchesRole(owner, role) {
  if (role === "agent") return true;
  if (owner === "Agent") return true;
  return owner.toLowerCase() === role;
}

function taskDefaultStatus(template, tx) {
  const due = calculateDueDate(template, tx);
  if (new Date(due) < startOfToday()) return "active";
  return "todo";
}

function calculateDueDate(template, tx) {
  if (Number.isFinite(template.daysBeforeClosing)) {
    return addDays(tx.closingDate, -Number(template.daysBeforeClosing));
  }
  return addDays(tx.contractDate, Number(template.daysFromContract || 0));
}

function addDays(dateString, days) {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function markSeedProgress(tx) {
  const doneIds = {
    MD: ["agent-kickoff", "title-order", "md-disclosure", "lead"],
    DC: ["agent-kickoff", "title-order", "dc-buyer-disclosure", "lead-buyer"],
    VA: ["agent-kickoff", "title-order", "va-disclosure", "va-resale", "appraisal"]
  };

  const activeIds = {
    MD: ["inspection-window", "md-hoa", "loan-application"],
    DC: ["lead-buyer", "dc-buyer-condo", "inspection-window"],
    VA: ["settlement-statement", "insurance", "walkthrough"]
  };

  tx.tasks.forEach((task) => {
    if ((doneIds[tx.jurisdiction] || []).includes(task.id)) task.status = "done";
    if ((activeIds[tx.jurisdiction] || []).includes(task.id)) task.status = "active";
  });
}

function currentUser() {
  return state.accounts.find((account) => account.id === state.currentUserId) || state.accounts[0];
}

function isAgent() {
  const role = currentUser()?.role;
  return role === "agent" || role === "admin";
}

function isAdmin() {
  return currentUser()?.role === "admin" || backendSession?.user?.role === "admin";
}

function canViewTransaction(tx, user = currentUser()) {
  if (!user) return false;
  if (user.role === "agent" || user.role === "admin") return true;
  if ((user.transactionIds || []).includes(tx.id)) return true;
  const email = (user.email || "").toLowerCase();
  return [...tx.sellers, ...tx.buyers].some((party) => (party.email || "").toLowerCase() === email);
}

function visibleTransactions() {
  return state.transactions.filter((tx) => canViewTransaction(tx));
}

function filteredTransactions() {
  const term = state.search.trim().toLowerCase();
  const txs = visibleTransactions();
  if (!term) return txs;
  return txs.filter((tx) => {
    const taskText = tx.tasks.map((task) => task.title).join(" ");
    const partyText = [...tx.sellers, ...tx.buyers].map((party) => `${party.name} ${party.email}`).join(" ");
    return `${tx.address} ${tx.client} ${tx.code} ${tx.stage} ${taskText} ${partyText}`.toLowerCase().includes(term);
  });
}

function selectedTransaction() {
  const visible = visibleTransactions();
  const selected = visible.find((tx) => tx.id === state.selectedId);
  if (selected) return selected;
  state.selectedId = visible[0]?.id || null;
  return visible[0] || null;
}

function messagesForCurrentUser(tx) {
  if (isAgent()) return tx.messages;
  const user = currentUser();
  return tx.messages.filter((message) => {
    if (message.visibility === "client") return true;
    return (message.author || "").toLowerCase() === (user.name || "").toLowerCase();
  });
}

function render() {
  if (state.view === "guestTimeline") {
    document.body.classList.remove("auth-view");
    document.body.classList.add("guest-view");
    renderGuestTimeline();
    return;
  }

  if (API_ENABLED && !backendSession && state.view !== "login") {
    state.view = "login";
  }

  document.body.classList.toggle("auth-view", state.view === "login");
  document.body.classList.remove("guest-view");

  if (state.view === "login") {
    renderLogin();
    return;
  }

  ensureSelectedIsVisible();
  renderAccountSelect();

  const root = document.querySelector("#appRoot");
  const viewTitle = document.querySelector("#viewTitle");
  const viewEyebrow = document.querySelector("#viewEyebrow");
  const titles = {
    dashboard: ["DMV Real Estate", "Dashboard"],
    leads: ["CRM Intake", "Leads"],
    transactions: ["Pipeline", "Transactions"],
    workflows: ["Rules and Timelines", "Workflows"],
    communications: ["Jira-style Email Log", "Messages"],
    access: ["Roles and Guests", "Access"],
    integrations: ["Google Workspace", "Integrations"],
    audit: ["Compliance Review", "Audit"],
    login: ["Authentication", "Login"]
  };

  if (!titles[state.view]) state.view = "dashboard";
  const [eyebrow, title] = titles[state.view] || titles.dashboard;
  viewEyebrow.textContent = eyebrow;
  viewTitle.textContent = title;

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === state.view);
  });
  updateTopbarControls();

  if (state.view === "dashboard") root.innerHTML = renderDashboard();
  if (state.view === "leads") root.innerHTML = renderLeads();
  if (state.view === "transactions") root.innerHTML = renderTransactions();
  if (state.view === "workflows") root.innerHTML = renderWorkflows();
  if (state.view === "communications") root.innerHTML = renderCommunications();
  if (state.view === "access") root.innerHTML = renderAccess();
  if (state.view === "integrations") root.innerHTML = renderIntegrations();
  if (state.view === "audit") root.innerHTML = renderAudit();

  bindDynamicEvents();
}

function renderGuestTimeline() {
  const root = document.querySelector("#appRoot");
  const tx = guestTimelineState?.transaction || state.transactions[0];
  document.querySelector("#viewEyebrow").textContent = "Guest Timeline";
  document.querySelector("#viewTitle").textContent = tx?.code || "Timeline";
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.remove("active"));
  updateTopbarControls();
  if (!tx) {
    root.innerHTML = renderEmpty("This guest timeline link is unavailable.");
    return;
  }
  root.innerHTML = `
    <section class="guest-timeline-shell">
      <div class="guest-header">
        <img
          class="login-logo"
          src="https://images.squarespace-cdn.com/content/v1/67098e72d0c8615e7ed9952d/47131350-96f1-4e2a-a866-0982489a0355/CO+Logo+-+Black.png?format=300w"
          alt="Champion Operations"
        />
        <div>
          <p class="eyebrow">Champion Operations</p>
          <h2>${escapeHtml(tx.address)}</h2>
          <div class="inline-meta">
            ${renderBadge(tx.code, "blue")}
            ${renderBadge(tx.stage, "green")}
            ${renderBadge(jurisdictionName(tx.jurisdiction), "gold")}
            <span>Close ${formatDate(tx.closingDate)}</span>
          </div>
        </div>
      </div>
      ${renderPropertySnapshot(tx)}
      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="section-kicker">Read Only</p>
            <h3>Transaction Timeline</h3>
          </div>
          ${renderBadge("Guest view", "green")}
        </div>
        <div class="timeline">
          ${renderTimelineTasks(tx.tasks, tx.id)}
        </div>
      </section>
      <section class="board" aria-label="Workflow by phase">
        ${PHASES.map((phase) => `
          <div class="board-column">
            <h3>${phase}</h3>
            <div class="timeline">
              ${renderTimelineTasks(tx.tasks.filter((task) => task.phase === phase), tx.id, true)}
            </div>
          </div>
        `).join("")}
      </section>
    </section>
  `;
  bindDynamicEvents();
}

function renderLogin() {
  const root = document.querySelector("#appRoot");
  document.querySelector("#viewEyebrow").textContent = "Authentication";
  document.querySelector("#viewTitle").textContent = "Login";
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.remove("active"));
  renderAccountSelect();
  updateTopbarControls();
  root.innerHTML = `
    <section class="login-panel branded-login">
      <div class="login-card">
        <div class="login-brand">
          <img
            class="login-logo"
            src="https://images.squarespace-cdn.com/content/v1/67098e72d0c8615e7ed9952d/47131350-96f1-4e2a-a866-0982489a0355/CO+Logo+-+Black.png?format=300w"
            alt="Champion Operations"
          />
          <div>
            <p class="section-kicker">Champion Operations</p>
            <h3>Transaction CRM</h3>
          </div>
        </div>
        <form id="loginForm">
          <label>
            Email
            <input name="email" type="email" required autocomplete="email" placeholder="agent@champion.local" />
          </label>
          <label>
            Password
            <input name="password" type="password" required autocomplete="current-password" />
          </label>
          <button class="primary-btn" type="submit">Login</button>
        </form>
        <p class="login-hint" id="loginError"></p>
        <div class="login-prompts" aria-label="Account help">
          <button class="chip-btn" type="button" data-auth-panel="accountRequestPanel">Create Account</button>
          <button class="chip-btn" type="button" data-auth-panel="passwordResetPanel">Reset Password</button>
          <button class="chip-btn" type="button" data-auth-panel="guestAccessPanel">Access as Guest</button>
        </div>
        <form class="auth-panel" id="accountRequestPanel" data-account-request hidden>
          <label>
            Name
            <input name="displayName" required autocomplete="name" />
          </label>
          <label>
            Email
            <input name="email" type="email" required autocomplete="email" />
          </label>
          <label>
            Requested role
            <select name="requestedRole">
              <option value="agent">Agent</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </label>
          <button class="primary-btn" type="submit">Request Account</button>
        </form>
        <form class="auth-panel" id="passwordResetPanel" data-password-reset hidden>
          <label>
            Account email
            <input name="email" type="email" required autocomplete="email" />
          </label>
          <button class="primary-btn" type="submit">Send Reset Request</button>
        </form>
        <form class="auth-panel" id="guestAccessPanel" data-guest-access hidden>
          <label>
            Guest timeline link or access code
            <input name="guestLink" required placeholder="Paste the timeline link" />
          </label>
          <button class="primary-btn" type="submit">Open Timeline</button>
        </form>
        <p class="login-hint" id="authPromptStatus"></p>
      </div>
    </section>
  `;
  bindDynamicEvents();
}

function updateTopbarControls() {
  const newButton = document.querySelector("#openNewTransaction");
  const logoutButton = document.querySelector("#logoutButton");
  const searchInput = document.querySelector("#searchInput");
  if (newButton) newButton.style.display = state.view !== "login" && isAgent() ? "" : "none";
  if (logoutButton) logoutButton.style.display = API_ENABLED ? "" : "none";
  if (searchInput) searchInput.disabled = state.view === "login";
}

function ensureSelectedIsVisible() {
  const visible = visibleTransactions();
  if (!visible.length) {
    state.selectedId = null;
    return;
  }
  if (!visible.some((tx) => tx.id === state.selectedId)) {
    state.selectedId = visible[0].id;
  }
}

function renderAccountSelect() {
  const select = document.querySelector("#accountSelect");
  if (!select) return;
  const status = document.querySelector("#backendStatus");
  select.innerHTML = state.accounts
    .map((account) => `<option value="${account.id}">${escapeHtml(account.name)} - ${roleLabel(account.role)}</option>`)
    .join("");
  select.value = state.currentUserId;
  select.disabled = Boolean(backendSession) || (API_ENABLED && state.view === "login");
  if (status) {
    if (backendSession) {
      status.textContent = `Backend session active as ${backendSession.user.email}. Permissions are enforced by the local API.`;
    } else if (API_ENABLED) {
      status.textContent = "Backend detected. Login is required for API-backed access.";
    } else {
      status.textContent = "Local browser mode. Run the backend for real session enforcement.";
    }
  }
}

function renderDashboard() {
  const txs = filteredTransactions();
  const selected = selectedTransaction();
  const allTasks = txs.flatMap((tx) => tx.tasks.map((task) => ({ ...task, tx })));
  const dueSoon = allTasks.filter((task) => task.status !== "done" && daysUntil(task.dueDate) <= 7).length;
  const blocked = allTasks.filter((task) => task.status === "blocked").length;
  const visibleMessages = txs.reduce((sum, tx) => sum + messagesForCurrentUser(tx).length, 0);

  return `
    <section class="summary-grid" aria-label="Portfolio summary">
      ${renderStat("Visible files", txs.length)}
      ${renderStat("Due in 7 days", dueSoon)}
      ${renderStat("Blocked", blocked)}
      ${renderStat("Visible messages", visibleMessages)}
    </section>

    <section class="dashboard-layout wide-detail">
      <div class="panel">
        <div class="panel-header">
          <div>
            <p class="section-kicker">Pipeline</p>
            <h3>Active Transactions</h3>
          </div>
          ${renderBadge(roleLabel(currentUser().role), isAdmin() || currentUser().role === "agent" ? "blue" : "green")}
        </div>
        <div class="transaction-list">
          ${txs.map((tx) => renderTransactionRow(tx, selected?.id === tx.id)).join("") || renderEmpty("No transactions match this account or search.")}
        </div>
      </div>
      <div class="detail-stack">
        ${selected ? renderTransactionDetail(selected) + renderPropertySnapshot(selected) + renderPartyPanel(selected) + renderDashboardMessages(selected) : renderEmpty("No transactions available for this account.")}
      </div>
    </section>
  `;
}

function renderStat(label, value) {
  return `
    <div class="stat-card">
      <strong>${value}</strong>
      <span>${label}</span>
    </div>
  `;
}

function renderTransactionRow(tx, isActive = false) {
  const openTasks = tx.tasks.filter((task) => task.status !== "done").length;
  return `
    <button class="transaction-row ${isActive ? "active" : ""}" type="button" data-select-transaction="${tx.id}">
      <div>
        <h3>${escapeHtml(tx.address)}</h3>
        <div class="transaction-meta">
          <span>${escapeHtml(primaryRecipient(tx))}</span>
          <span>${tx.code}</span>
          <span>${formatCurrency(tx.price)}</span>
        </div>
      </div>
      <div class="transaction-meta">
        ${renderBadge(tx.jurisdiction, "blue")}
        ${renderBadge(tx.stage, "green")}
        ${renderBadge(`${activeBuyers(tx).length} active buyer${activeBuyers(tx).length === 1 ? "" : "s"}`, "blue")}
        ${renderBadge(`${openTasks} open`, openTasks > 4 ? "gold" : "")}
      </div>
    </button>
  `;
}

function renderTransactionDetail(tx) {
  const taskGroups = groupByPhase(tx.tasks);
  const nextTasks = tx.tasks.filter((task) => task.status !== "done").slice(0, 8);
  return `
    <section class="detail-hero">
      <div>
        <p class="eyebrow">${tx.code} - ${roleLabel(tx.role)} workflow</p>
        <h3>${escapeHtml(tx.address)}</h3>
        <div class="inline-meta">
          <span>${escapeHtml(primaryRecipient(tx))}</span>
          <span>${tx.jurisdiction}</span>
          <span>${propertyTypeLabel(tx.propertyType)}</span>
          <span>Contract ${formatDate(tx.contractDate)}</span>
          <span>Close ${formatDate(tx.closingDate)}</span>
        </div>
      </div>
      <div class="hero-actions">
        <button class="ghost-btn" type="button" data-jump-view="communications">${isAgent() ? "Log Message" : "Leave Comment"}</button>
        <button class="ghost-btn" type="button" data-calendar-draft="${tx.id}">Calendar Draft</button>
        ${isAgent() ? `<button class="ghost-btn" type="button" data-gmail-draft="${tx.id}">Gmail Draft</button>` : ""}
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="section-kicker">Next Actions</p>
          <h3>Timeline</h3>
        </div>
        <div class="segmented" aria-label="Task filter">
          ${["all", "todo", "active", "done", "blocked"].map((status) => `
            <button type="button" class="${state.taskFilter === status ? "active" : ""}" data-task-filter="${status}">
              ${status === "all" ? "All" : STATUS_LABELS[status]}
            </button>
          `).join("")}
        </div>
      </div>
      <div class="timeline">
        ${renderTimelineTasks(nextTasks, tx.id)}
      </div>
    </section>

    <section class="board" aria-label="Workflow by phase">
      ${PHASES.map((phase) => `
        <div class="board-column">
          <h3>${phase}</h3>
          <div class="timeline">
            ${renderTimelineTasks((taskGroups[phase] || []).slice(0, 4), tx.id, true)}
          </div>
        </div>
      `).join("")}
    </section>
  `;
}

function renderPropertySnapshot(tx) {
  const photoUrl = tx.media?.photoUrl || streetViewImageUrl(tx.address);
  const photoLabel = tx.media?.photoUrl ? "Property photo" : "Street View preview";
  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="section-kicker">Property</p>
          <h3>Photo and Location</h3>
        </div>
        <div class="inline-meta">
          <a class="chip-btn" href="${googleMapsSearchUrl(tx.address)}" target="_blank" rel="noreferrer">Open Map</a>
          ${isAgent() && tx.guestToken ? `<button class="chip-btn" type="button" data-copy-guest-link="${tx.id}">Guest Link</button>` : ""}
          ${tx.media?.tourUrl ? `<a class="chip-btn" href="${escapeAttribute(tx.media.tourUrl)}" target="_blank" rel="noreferrer">Virtual Tour</a>` : ""}
        </div>
      </div>
      <div class="property-grid">
        <div class="property-photo">
          <img
            src="${escapeAttribute(photoUrl)}"
            alt="${photoLabel} for ${escapeAttribute(tx.address)}"
            loading="lazy"
            onerror="this.closest('.property-photo').classList.add('image-failed')"
          />
          <div class="property-photo-placeholder">
            <span>${escapeHtml(tx.address)}</span>
            <small>${tx.media?.photoUrl ? "Image unavailable" : "Street View fallback needs a Google Maps API key"}</small>
          </div>
        </div>
        <iframe
          class="map-frame"
          title="Map for ${escapeAttribute(tx.address)}"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          src="${googleMapsEmbedUrl(tx.address)}">
        </iframe>
      </div>
      ${isAgent() ? `
        <form class="inline-form media-form" data-property-media="${tx.id}">
          <input name="photoUrl" type="url" placeholder="Listing photo URL" value="${escapeAttribute(tx.media?.photoUrl || "")}" />
          <input name="tourUrl" type="url" placeholder="Virtual tour URL" value="${escapeAttribute(tx.media?.tourUrl || "")}" />
          <button class="primary-btn" type="submit">Update Media</button>
        </form>
      ` : ""}
    </section>
  `;
}

function renderTimelineTasks(tasks, txId, compact = false) {
  const filtered = tasks.filter((task) => state.taskFilter === "all" || task.status === state.taskFilter);
  if (!filtered.length) return renderEmpty("No tasks in this filter.");
  return filtered
    .map((task) => `
      <article class="task-card">
        <button class="task-status ${task.status}" type="button" ${isAgent() ? `data-toggle-task="${txId}:${task.id}"` : "disabled"} aria-label="Toggle ${escapeHtml(task.title)}"></button>
        <div>
          <div class="inline-meta">
            ${renderBadge(task.owner)}
            ${renderBadge(task.priority, task.priority === "High" ? "rose" : "gold")}
            ${renderBadge(dueLabel(task.dueDate), daysUntil(task.dueDate) < 0 ? "rose" : "")}
          </div>
          <h4>${escapeHtml(task.title)}</h4>
          ${compact ? "" : `<p class="task-note">${escapeHtml(task.note)}</p>`}
          ${renderTaskSources(task)}
        </div>
        ${isAgent() ? `
          <div class="task-actions">
            <button type="button" data-set-task="${txId}:${task.id}:active">Active</button>
            <button type="button" data-set-task="${txId}:${task.id}:blocked">Block</button>
          </div>
        ` : ""}
      </article>
    `)
    .join("");
}

function renderTaskSources(task) {
  const linkedSources = (task.sourceIds || [])
    .filter((id) => SOURCES[id])
    .map((id) => `<a href="${SOURCES[id].url}" target="_blank" rel="noreferrer">${escapeHtml(SOURCES[id].label)}</a>`);
  if (task.sourceUrl) {
    linkedSources.push(`<a href="${escapeAttribute(task.sourceUrl)}" target="_blank" rel="noreferrer">Custom source</a>`);
  }
  return linkedSources.length ? `<div class="inline-meta">${linkedSources.join("")}</div>` : "";
}

function renderPartyPanel(tx) {
  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="section-kicker">Parties</p>
          <h3>Buyers and Sellers</h3>
        </div>
        ${isAgent() ? `<button class="ghost-btn danger" type="button" data-reset-buyers="${tx.id}">Reset Buyers</button>` : renderBadge("View only", "green")}
      </div>
      <div class="party-grid">
        <div>
          <p class="section-kicker">Sellers</p>
          <div class="party-list">
            ${tx.sellers.map((seller) => renderPartyCard(seller, "seller", tx.id)).join("")}
          </div>
        </div>
        <div>
          <p class="section-kicker">Potential Buyers</p>
          <div class="party-list">
            ${tx.buyers.map((buyer) => renderPartyCard(buyer, "buyer", tx.id)).join("") || renderEmpty("No buyers are attached yet.")}
          </div>
          ${isAgent() ? renderBuyerForm(tx) : ""}
        </div>
      </div>
    </section>
  `;
}

function renderPartyCard(party, kind, txId) {
  const tone = party.status === "active" ? "green" : party.status === "backup" ? "gold" : "rose";
  return `
    <article class="party-card">
      <div>
        <strong>${escapeHtml(party.name)}</strong>
        <span>${escapeHtml(party.email || "No email")}</span>
      </div>
      <div class="inline-meta">
        ${renderBadge(party.status, tone)}
        ${isAgent() && kind === "buyer" ? `
          <button class="chip-btn" type="button" data-party-status="${txId}:${party.id}:active">Active</button>
          <button class="chip-btn" type="button" data-party-status="${txId}:${party.id}:backup">Backup</button>
          <button class="chip-btn danger" type="button" data-party-status="${txId}:${party.id}:removed">Remove</button>
        ` : ""}
      </div>
    </article>
  `;
}

function renderBuyerForm(tx) {
  return `
    <form class="inline-form" data-add-buyer="${tx.id}">
      <input name="name" placeholder="Buyer name" required />
      <input name="email" type="email" placeholder="buyer@example.com" />
      <select name="status">
        <option value="active">Active</option>
        <option value="backup">Backup</option>
      </select>
      <button class="primary-btn" type="submit">Add Buyer</button>
    </form>
  `;
}

function renderDashboardMessages(tx) {
  const messages = messagesForCurrentUser(tx).slice(0, 4);
  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="section-kicker">${tx.code}</p>
          <h3>Recent Messages</h3>
        </div>
        <button class="ghost-btn" type="button" data-jump-view="communications">Open Thread</button>
      </div>
      <div class="message-list compact-list">
        ${messages.map((message) => renderMessageCard(message)).join("") || renderEmpty("No visible messages yet.")}
      </div>
      ${renderCommentForm(tx)}
    </section>
  `;
}

function renderLeads() {
  if (!isAgent()) return renderEmpty("Lead intake is available to agent accounts only.");
  const leads = state.leads || [];
  return `
    <section class="lead-grid">
      <div class="panel">
        <div class="panel-header">
          <div>
            <p class="section-kicker">New Inquiry</p>
            <h3>Add Lead</h3>
          </div>
          ${renderBadge(`${leads.length} stored`, "blue")}
        </div>
        <form class="form-grid" id="leadForm">
          <label>
            Name
            <input name="name" required placeholder="Jordan Smith" />
          </label>
          <label>
            Lead type
            <select name="leadType" required>
              <option value="BUYER">Buyer</option>
              <option value="SELLER">Seller</option>
              <option value="BOTH">Buyer and seller</option>
              <option value="OTHER">Other</option>
            </select>
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="jordan@example.com" />
          </label>
          <label>
            Phone
            <input name="phone" type="tel" placeholder="202-555-0147" />
          </label>
          <label>
            Source
            <input name="source" placeholder="Website, referral, open house" />
          </label>
          <label>
            Jurisdiction
            <select name="jurisdiction">
              <option value="">Select</option>
              <option value="MD">Maryland</option>
              <option value="DC">District of Columbia</option>
              <option value="VA">Virginia</option>
            </select>
          </label>
          <label class="full-span">
            Property address or area
            <input name="propertyAddress" placeholder="Address, neighborhood, or target area" />
          </label>
          <label class="full-span">
            Notes
            <textarea name="notes" placeholder="Timing, budget, property details, or next step"></textarea>
          </label>
          <div class="modal-actions full-span">
            <button class="primary-btn" type="submit">Save and Notify</button>
          </div>
        </form>
        <p class="login-hint" id="leadFormStatus">Airtable receives the lead record. Make.com receives one event with email and SMS-ready fields.</p>
      </div>
      <div class="panel">
        <div class="panel-header">
          <div>
            <p class="section-kicker">Lead Queue</p>
            <h3>Recent Leads</h3>
          </div>
          ${renderBadge("Newest first", "green")}
        </div>
        <div class="lead-list">
          ${leads.map(renderLeadCard).join("") || renderEmpty("No leads yet. Add the first inquiry to begin the intake workflow.")}
        </div>
      </div>
    </section>
  `;
}

function renderLeadCard(lead) {
  const contact = [lead.email, lead.phone].filter(Boolean).join(" - ") || "No contact details";
  const integrationError = lead.lastIntegrationError
    ? `<p class="lead-note">${escapeHtml(lead.lastIntegrationError)}</p>`
    : "";
  return `
    <article class="lead-card">
      <div class="lead-card-header">
        <div>
          <h4>${escapeHtml(lead.name)}</h4>
          <p class="lead-contact">${escapeHtml(contact)}</p>
        </div>
        <select class="lead-status-control" data-lead-status="${lead.id}" aria-label="Lead status">
          ${["new", "contacted", "qualified", "converted", "lost"].map((status) => `
            <option value="${status}" ${lead.status === status ? "selected" : ""}>${capitalize(status)}</option>
          `).join("")}
        </select>
      </div>
      <div class="inline-meta">
        ${renderBadge(capitalize(lead.leadType), "blue")}
        ${lead.source ? renderBadge(lead.source, "gold") : ""}
        ${lead.jurisdiction ? renderBadge(lead.jurisdiction, "green") : ""}
        ${renderBadge(`Airtable ${capitalize(lead.airtableSyncStatus)}`, lead.airtableSyncStatus === "sent" ? "green" : "gold")}
        ${renderBadge(`Make ${capitalize(lead.makeDeliveryStatus)}`, lead.makeDeliveryStatus === "sent" ? "green" : "gold")}
      </div>
      ${lead.propertyAddress ? `<p class="lead-note"><strong>Property:</strong> ${escapeHtml(lead.propertyAddress)}</p>` : ""}
      ${lead.notes ? `<p class="lead-note">${escapeHtml(lead.notes)}</p>` : ""}
      ${integrationError}
      <div class="lead-card-footer">
        <span class="lead-contact">${lead.createdAt ? formatDateTime(lead.createdAt) : "Just now"}</span>
        ${(lead.airtableSyncStatus === "failed" || lead.makeDeliveryStatus === "failed")
          ? `<button class="ghost-btn" type="button" data-retry-lead="${lead.id}">Retry integrations</button>`
          : ""}
      </div>
    </article>
  `;
}

function renderTransactions() {
  const txs = filteredTransactions();
  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="section-kicker">CRM Records</p>
          <h3>Transactions</h3>
        </div>
        ${isAgent() ? `<button class="primary-btn" type="button" data-open-new>New Transaction</button>` : renderBadge("Guest view", "green")}
      </div>
      <div class="transaction-list">
        ${txs.map((tx) => renderTransactionRow(tx, selectedTransaction()?.id === tx.id)).join("") || renderEmpty("No transactions yet.")}
      </div>
    </section>
  `;
}

function renderWorkflows() {
  const builtinByJurisdiction = ["MD", "DC", "VA"].map((jurisdiction) => {
    const tasks = BUILT_IN_RULES.filter((template) => template.jurisdiction === jurisdiction);
    return `
      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="section-kicker">${jurisdiction}</p>
            <h3>${jurisdictionName(jurisdiction)} Rules</h3>
          </div>
          ${renderBadge(`${tasks.length} templates`, "blue")}
        </div>
        <div class="timeline">
          ${tasks.map((task) => renderRuleCard(task, false)).join("")}
        </div>
      </section>
    `;
  });

  return `
    ${isAgent() ? renderRuleBuilder() : ""}
    <section class="workflow-grid">${builtinByJurisdiction.join("")}</section>
    <section class="panel" style="margin-top: 16px;">
      <div class="panel-header">
        <div>
          <p class="section-kicker">Custom</p>
          <h3>Editable Workflow Rules</h3>
        </div>
        ${renderBadge(`${state.customRules.length} custom`, "blue")}
      </div>
      <div class="timeline">
        ${state.customRules.map((rule) => renderRuleCard(rule, true)).join("") || renderEmpty("No custom workflow rules yet.")}
      </div>
    </section>
    <section class="panel" style="margin-top: 16px;">
      <div class="panel-header">
        <div>
          <p class="section-kicker">Audit Trail</p>
          <h3>Source Links</h3>
        </div>
      </div>
      <div class="source-grid">
        ${Object.values(SOURCES).map((source) => renderSourceCard(source)).join("")}
      </div>
    </section>
  `;
}

function renderRuleBuilder() {
  return `
    <section class="panel rule-builder">
      <div class="panel-header">
        <div>
          <p class="section-kicker">Rule Builder</p>
          <h3>Add Timeline Rule</h3>
        </div>
      </div>
      <form class="form-grid" id="ruleForm">
        <label>
          Rule title
          <input name="title" required placeholder="Confirm jurisdiction-specific addendum" />
        </label>
        <label>
          Jurisdiction
          <select name="jurisdiction">
            <option value="All">All</option>
            <option value="MD">Maryland</option>
            <option value="DC">District of Columbia</option>
            <option value="VA">Virginia</option>
          </select>
        </label>
        <label>
          Owner
          <select name="owner">
            <option value="Agent">Agent</option>
            <option value="Buyer">Buyer</option>
            <option value="Seller">Seller</option>
          </select>
        </label>
        <label>
          Phase
          <select name="phase">
            ${PHASES.map((phase) => `<option value="${phase}">${phase}</option>`).join("")}
          </select>
        </label>
        <label>
          Basis
          <select name="basis">
            <option value="contract">Days from contract</option>
            <option value="closing">Days before closing</option>
          </select>
        </label>
        <label>
          Days
          <input name="days" required type="number" value="3" />
        </label>
        <label>
          Priority
          <select name="priority">
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>
        <label>
          Property type
          <select name="propertyType">
            <option value="all">All</option>
            <option value="single-family">Single family</option>
            <option value="condo">Condo</option>
            <option value="townhome">Townhome / HOA</option>
            <option value="multi-unit">2-4 unit residential</option>
          </select>
        </label>
        <label class="full-span">
          Note
          <textarea name="note" required placeholder="What should the transaction team verify?"></textarea>
        </label>
        <label class="full-span">
          Source URL
          <input name="sourceUrl" type="url" placeholder="https://..." />
        </label>
        <div class="modal-actions full-span">
          <button class="primary-btn" type="submit">Add Rule and Apply</button>
        </div>
      </form>
    </section>
  `;
}

function renderRuleCard(rule, custom) {
  const basisLabel = rule.daysBeforeClosing !== undefined || rule.basis === "closing"
    ? `${rule.daysBeforeClosing ?? rule.days}d before close`
    : `${rule.daysFromContract ?? rule.days ?? 0}d from contract`;
  return `
    <article class="task-card">
      <div class="task-status"></div>
      <div>
        <div class="inline-meta">
          ${renderBadge(rule.owner)}
          ${renderBadge(rule.phase, "green")}
          ${renderBadge(rule.jurisdiction || "All", "blue")}
          ${renderBadge(basisLabel, "gold")}
        </div>
        <h4>${escapeHtml(rule.title)}</h4>
        <p class="task-note">${escapeHtml(rule.note)}</p>
        ${rule.sourceUrl ? `<div class="inline-meta"><a href="${escapeAttribute(rule.sourceUrl)}" target="_blank" rel="noreferrer">Custom source</a></div>` : ""}
      </div>
      ${custom && isAgent() ? `
        <div class="task-actions">
          <button type="button" data-delete-rule="${rule.id}">Delete</button>
        </div>
      ` : ""}
    </article>
  `;
}

function renderSourceCard(source) {
  return `
    <article class="source-card">
      <div class="inline-meta">
        ${renderBadge(source.authority, "blue")}
        ${renderBadge(`Checked ${formatDate(source.lastVerified)}`, "green")}
      </div>
      <h4>${escapeHtml(source.label)}</h4>
      <p>${escapeHtml(source.summary)}</p>
      <a href="${source.url}" target="_blank" rel="noreferrer">Open source</a>
    </article>
  `;
}

function renderCommunications() {
  const tx = selectedTransaction();
  if (!tx) return renderEmpty("No transaction is available for this account.");
  return `
    <section class="message-grid">
      <div class="panel">
        <div class="panel-header">
          <div>
            <p class="section-kicker">${tx.code}</p>
            <h3>Thread Log</h3>
          </div>
          ${renderBadge(`${messagesForCurrentUser(tx).length} visible`, "blue")}
        </div>
        <div class="message-list">
          ${messagesForCurrentUser(tx).map((message) => renderMessageCard(message)).join("") || renderEmpty("No visible messages yet.")}
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <div>
            <p class="section-kicker">${isAgent() ? "Outbound" : "Guest"}</p>
            <h3>${isAgent() ? "Email Composer" : "Comment"}</h3>
          </div>
        </div>
        ${isAgent() ? renderMessageComposer(tx) : renderCommentForm(tx)}
      </div>
    </section>
  `;
}

function renderMessageComposer(tx) {
  return `
    <form class="composer" id="messageForm">
      <label>
        Template
        <select name="template">
          ${Object.entries(MESSAGE_TEMPLATES).map(([key, template]) => `<option value="${key}">${template.label}</option>`).join("")}
        </select>
      </label>
      <label>
        To
        <input name="to" value="${escapeAttribute(primaryEmail(tx))}" />
      </label>
      <label>
        Subject
        <input name="subject" value="[${tx.code}] ${escapeAttribute(fillTemplate(MESSAGE_TEMPLATES.kickoff.subject, tx))}" />
      </label>
      <label>
        Message
        <textarea name="body">${escapeHtml(fillTemplate(MESSAGE_TEMPLATES.kickoff.body, tx))}</textarea>
      </label>
      <div class="modal-actions">
        <button class="ghost-btn" type="button" id="openMailto">Open Email Draft</button>
        <button class="ghost-btn" type="button" data-gmail-draft="${tx.id}">Gmail Draft</button>
        <button class="primary-btn" type="submit">Log to Transaction</button>
      </div>
    </form>
  `;
}

function renderCommentForm(tx) {
  return `
    <form class="composer compact-composer" data-comment-form="${tx.id}">
      <label>
        Comment
        <textarea name="body" required placeholder="Leave a note for the transaction team"></textarea>
      </label>
      <div class="modal-actions">
        <button class="primary-btn" type="submit">Add Comment</button>
      </div>
    </form>
  `;
}

function renderMessageCard(message) {
  const tone = message.channel === "comment" ? "gold" : "green";
  return `
    <article class="message-card">
      <div class="message-meta">
        ${renderBadge(message.channel, tone)}
        ${renderBadge(message.visibility, "blue")}
        <span>${formatDateTime(message.createdAt)}</span>
        <span>${escapeHtml(message.author || message.to)}</span>
      </div>
      <h4>${escapeHtml(message.subject)}</h4>
      <p>${escapeHtml(message.body).replaceAll("\n", "<br>")}</p>
    </article>
  `;
}

function renderAccess() {
  const springAccounts = backendSession && backendMode === "spring";
  return `
    <section class="dashboard-layout">
      <div class="panel">
        <div class="panel-header">
          <div>
            <p class="section-kicker">Session</p>
            <h3>${springAccounts ? "Portal Access" : "Local Login Model"}</h3>
          </div>
          ${renderBadge(roleLabel(currentUser().role), isAdmin() ? "blue" : "green")}
        </div>
        <ul class="deploy-list">
          <li><strong>Current:</strong> ${escapeHtml(currentUser().name)} can view ${visibleTransactions().length} transaction file${visibleTransactions().length === 1 ? "" : "s"}.</li>
          <li><strong>Administrators:</strong> can provision administrators, agents, buyers, and sellers.</li>
          <li><strong>Agents:</strong> can provision buyers and sellers. Staff-account creation remains administrator-only.</li>
          <li><strong>Guests:</strong> use transaction-specific timeline links and can add comments without editing workflow status.</li>
          ${springAccounts ? "" : "<li><strong>Demo mode:</strong> local account switching is stored only in this browser.</li>"}
        </ul>
      </div>
      <div class="panel">
        <div class="panel-header">
          <div>
            <p class="section-kicker">Accounts</p>
            <h3>${springAccounts ? "Portal Users" : "Guest Access"}</h3>
          </div>
        </div>
        ${springAccounts ? renderUserManagement() : `
          <div class="account-list">
            ${state.accounts.map((account) => renderAccountCard(account)).join("")}
          </div>
          ${isAgent() ? renderGuestAccountForm() : ""}
        `}
      </div>
    </section>
  `;
}

function renderUserManagement() {
  const users = state.users || [];
  return `
    <div class="account-list">
      ${users.map(renderProvisionedUserCard).join("") || renderEmpty("No portal users are provisioned yet.")}
    </div>
    ${renderProvisionUserForm()}
  `;
}

function renderProvisionedUserCard(user) {
  return `
    <article class="party-card">
      <div>
        <strong>${escapeHtml(user.name)}</strong>
        <span>${escapeHtml(user.email)}</span>
      </div>
      <div class="inline-meta">
        ${renderBadge(roleLabel(user.role), user.role === "admin" || user.role === "agent" ? "blue" : "green")}
        ${renderBadge(user.enabled ? "Enabled" : "Disabled", user.enabled ? "green" : "gold")}
        ${user.email === backendSession?.user?.email ? renderBadge("Current", "gold") : ""}
      </div>
    </article>
  `;
}

function renderProvisionUserForm() {
  const roleOptions = isAdmin()
    ? `
      <option value="BUYER">Buyer</option>
      <option value="SELLER">Seller</option>
      <option value="AGENT">Agent</option>
      <option value="ADMIN">Administrator</option>
    `
    : `
      <option value="BUYER">Buyer</option>
      <option value="SELLER">Seller</option>
    `;
  return `
    <form class="inline-form stacked" id="provisionUserForm">
      <p class="section-kicker">Provision User</p>
      <input name="displayName" required placeholder="Full name" autocomplete="name" />
      <input name="email" type="email" required placeholder="user@example.com" autocomplete="email" />
      <select name="role" required>${roleOptions}</select>
      <input name="temporaryPassword" type="password" required minlength="12" placeholder="Temporary password (12+ characters)" autocomplete="new-password" />
      <button class="primary-btn" type="submit">Create Portal Account</button>
      <p class="login-hint" id="userProvisionStatus">The user can sign in with this email and temporary password.</p>
    </form>
  `;
}

function renderAccountCard(account) {
  const visibleCount = account.role === "agent" || account.role === "admin" ? state.transactions.length : (account.transactionIds || []).length;
  return `
    <article class="party-card">
      <div>
        <strong>${escapeHtml(account.name)}</strong>
        <span>${escapeHtml(account.email || "No email")} - ${visibleCount} file${visibleCount === 1 ? "" : "s"}</span>
      </div>
      <div class="inline-meta">
        ${renderBadge(roleLabel(account.role), account.role === "agent" ? "blue" : "green")}
        ${account.id !== state.currentUserId ? `<button class="chip-btn" type="button" data-switch-account="${account.id}">Switch</button>` : renderBadge("Active", "gold")}
      </div>
    </article>
  `;
}

function renderGuestAccountForm() {
  const options = state.transactions
    .map((tx) => `<option value="${tx.id}">${escapeHtml(tx.address)} - ${tx.code}</option>`)
    .join("");
  return `
    <form class="inline-form stacked" id="guestForm">
      <input name="name" required placeholder="Guest name" />
      <input name="email" type="email" placeholder="guest@example.com" />
      <select name="role">
        <option value="buyer">Buyer guest</option>
        <option value="seller">Seller guest</option>
      </select>
      <select name="transactionId">${options}</select>
      <button class="primary-btn" type="submit">Create Guest</button>
    </form>
  `;
}

function renderIntegrations() {
  const tx = selectedTransaction();
  return `
    <section class="dashboard-layout">
      <div class="panel">
        <div class="panel-header">
          <div>
            <p class="section-kicker">Google Calendar</p>
            <h3>Scheduling</h3>
          </div>
          ${renderBadge(state.integrations.googleCalendar.status, "gold")}
        </div>
        <ul class="deploy-list">
          <li><strong>Local action:</strong> create a Google Calendar draft link for the selected transaction.</li>
          <li><strong>Production action:</strong> use OAuth and the Calendar API events endpoint with a server-held refresh token.</li>
          <li><strong>Scope posture:</strong> request the narrowest calendar scope that supports the final workflow.</li>
        </ul>
        ${tx ? renderIntegrationActions(tx, "calendar") : renderEmpty("Select a transaction to create a calendar draft.")}
      </div>
      <div class="panel">
        <div class="panel-header">
          <div>
            <p class="section-kicker">Gmail</p>
            <h3>Automated Email</h3>
          </div>
          ${renderBadge(state.integrations.gmail.status, "gold")}
        </div>
        <ul class="deploy-list">
          <li><strong>Local action:</strong> open Gmail compose or log an email preview without sending.</li>
          <li><strong>Production action:</strong> send through Gmail API with OAuth, message creation, and a server-side queue.</li>
          <li><strong>Domain action:</strong> set SPF, DKIM, and DMARC before sending client mail from a real domain.</li>
        </ul>
        ${tx ? renderIntegrationActions(tx, "gmail") : renderEmpty("Select a transaction to create a Gmail draft.")}
      </div>
      <div class="panel">
        <div class="panel-header">
          <div>
            <p class="section-kicker">Account Linking</p>
            <h3>Google Workspace</h3>
          </div>
          ${renderBadge(backendSession ? "Backend ready" : "Backend required", backendSession ? "green" : "gold")}
        </div>
        <ul class="deploy-list">
          <li><strong>Calendar:</strong> request event access for scheduling property events.</li>
          <li><strong>Gmail:</strong> request send access for transaction messages and reminders.</li>
          <li><strong>Storage:</strong> refresh tokens stay encrypted in the Spring backend database.</li>
        </ul>
        <div class="modal-actions">
          <button class="primary-btn" type="button" data-link-google>Link Google Account</button>
        </div>
      </div>
    </section>
    <section class="source-grid" style="margin-top: 16px;">
      ${["googleCalendar", "gmailSending", "googleOAuthScopes"].map((id) => renderSourceCard(SOURCES[id])).join("")}
    </section>
  `;
}

function renderIntegrationActions(tx, kind) {
  if (kind === "calendar") {
    return `
      <div class="modal-actions">
        <button class="primary-btn" type="button" data-calendar-draft="${tx.id}">Open Calendar Draft</button>
        <button class="ghost-btn" type="button" data-log-integration="${tx.id}:calendar">Log Scheduling Preview</button>
      </div>
    `;
  }
  return `
    <div class="modal-actions">
      <button class="primary-btn" type="button" data-gmail-draft="${tx.id}">Open Gmail Draft</button>
      <button class="ghost-btn" type="button" data-log-integration="${tx.id}:gmail">Log Email Preview</button>
    </div>
  `;
}

function renderAudit() {
  const results = computeAuditResults();
  const counts = {
    ok: results.filter((result) => result.status === "ok").length,
    warn: results.filter((result) => result.status === "warn").length,
    missing: results.filter((result) => result.status === "missing").length
  };

  return `
    <section class="summary-grid" aria-label="Audit summary">
      ${renderStat("Passing", counts.ok)}
      ${renderStat("Warnings", counts.warn)}
      ${renderStat("Missing", counts.missing)}
      ${renderStat("Sources", Object.keys(SOURCES).length)}
    </section>
    <section class="dashboard-layout">
      <div class="panel">
        <div class="panel-header">
          <div>
            <p class="section-kicker">Workflow Audit</p>
            <h3>Rules Coverage</h3>
          </div>
          <button class="primary-btn" type="button" id="runAudit">Run Snapshot</button>
        </div>
        <div class="timeline">
          ${results.map(renderAuditCard).join("")}
        </div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <div>
            <p class="section-kicker">Notes</p>
            <h3>Potential Gaps</h3>
          </div>
        </div>
        <ul class="deploy-list">
          <li>County, city, brokerage, lender, title, septic/well, rental-license, smoke/CO, local tax, and property-condition requirements are not fully enumerated in this starter.</li>
          <li>Contract-specific contingency periods should be entered per file because they vary by signed agreement.</li>
          <li>Custom rules without a source URL are flagged during audit so future reviewers can decide whether they are policy, legal, or operational rules.</li>
          <li>Last verified source date is ${formatDate(CURRENT_SOURCE_CHECK_DATE)}. Recheck sources before production launch and on a recurring schedule.</li>
        </ul>
        <div class="timeline">
          ${state.auditRuns.slice(0, 5).map((run) => `
            <article class="message-card">
              <div class="message-meta">${renderBadge("audit", "blue")}<span>${formatDateTime(run.createdAt)}</span></div>
              <h4>${run.summary}</h4>
              <p>${escapeHtml(run.notes)}</p>
            </article>
          `).join("") || renderEmpty("No audit snapshots have been saved.")}
        </div>
      </div>
    </section>
  `;
}

function computeAuditResults() {
  const ruleIds = new Set([...BUILT_IN_RULES, ...state.customRules].map((rule) => rule.id));
  const sourceAgeWarnings = new Set(
    Object.entries(SOURCES)
      .filter(([, source]) => daysSince(source.lastVerified) > 90)
      .map(([id]) => id)
  );

  const checks = AUDIT_CHECKS.map((check) => {
    const missing = check.requiredRuleIds.filter((id) => !ruleIds.has(id));
    const staleSources = check.sourceIds.filter((id) => sourceAgeWarnings.has(id));
    const status = missing.length ? "missing" : staleSources.length ? "warn" : "ok";
    return {
      ...check,
      status,
      missing,
      staleSources
    };
  });

  state.customRules
    .filter((rule) => !rule.sourceUrl)
    .forEach((rule) => {
      checks.push({
        id: `custom-${rule.id}`,
        label: `Custom rule source check: ${rule.title}`,
        status: "warn",
        missing: [],
        staleSources: [],
        sourceIds: [],
        note: "Custom rule does not include a source URL. Add one when this represents law, regulation, or brokerage policy."
      });
    });

  return checks;
}

function renderAuditCard(result) {
  const tone = result.status === "ok" ? "green" : result.status === "warn" ? "gold" : "rose";
  const detail = result.missing.length
    ? `Missing rules: ${result.missing.join(", ")}`
    : result.staleSources.length
      ? `Source recheck needed: ${result.staleSources.map((id) => SOURCES[id]?.label || id).join(", ")}`
      : result.note;
  return `
    <article class="task-card">
      <div class="task-status ${result.status === "ok" ? "done" : result.status === "missing" ? "blocked" : ""}"></div>
      <div>
        <div class="inline-meta">
          ${renderBadge(result.status, tone)}
          ${(result.sourceIds || []).map((id) => SOURCES[id] ? renderBadge(SOURCES[id].authority, "blue") : "").join("")}
        </div>
        <h4>${escapeHtml(result.label)}</h4>
        <p class="task-note">${escapeHtml(detail)}</p>
        ${(result.sourceIds || []).length ? `<div class="inline-meta">${result.sourceIds.map((id) => `<a href="${SOURCES[id].url}" target="_blank" rel="noreferrer">${escapeHtml(SOURCES[id].label)}</a>`).join("")}</div>` : ""}
      </div>
    </article>
  `;
}

function renderMarket() {
  return `
    <section class="dashboard-layout">
      <div class="panel">
        <div class="panel-header">
          <div>
            <p class="section-kicker">Market Scan</p>
            <h3>Comparable Tools</h3>
          </div>
          ${renderBadge("Official sources checked", "green")}
        </div>
        <div class="market-grid">
          ${MARKET_COMPARISON.map((tool) => `
            <article class="market-card">
              <div class="inline-meta">
                ${renderBadge(tool.name, "blue")}
                <a href="${SOURCES[tool.sourceId].url}" target="_blank" rel="noreferrer">Source</a>
              </div>
              <h4>Common Strength</h4>
              <p>${escapeHtml(tool.focus)}</p>
              <h4>Champion Opening</h4>
              <p>${escapeHtml(tool.gapForChampion)}</p>
            </article>
          `).join("")}
        </div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <div>
            <p class="section-kicker">Differentiation</p>
            <h3>What Makes This Distinct</h3>
          </div>
        </div>
        <ul class="deploy-list">
          ${CHAMPION_DIFFERENTIATORS.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>
    </section>
    <section class="source-grid" style="margin-top: 16px;">
      ${["championBrand", "dotloop", "skyslope", "opentoclose", "brokermint"].map((id) => renderSourceCard(SOURCES[id])).join("")}
    </section>
  `;
}

function renderSettings() {
  return `
    <section class="dashboard-layout">
      <div class="panel">
        <div class="panel-header">
          <div>
            <p class="section-kicker">Local First</p>
            <h3>Cost-Minimized Build Path</h3>
          </div>
        </div>
        <ul class="deploy-list">
          <li><strong>Now:</strong> static browser app, no hosting bill, no database bill, no vendor lock-in. Export JSON for backups.</li>
          <li><strong>Next:</strong> add real authentication and a Postgres backend with Supabase or Neon. Start on a free tier, then migrate the same transaction, party, task, rule, account, and message model.</li>
          <li><strong>Access:</strong> use row-level permissions so buyers and sellers can see only transactions connected to their account.</li>
          <li><strong>Email:</strong> use transaction aliases like <code>tx-md-001@yourdomain.com</code>. Outbound mail can use Gmail API, Resend, Postmark, SendGrid, or Amazon SES; inbound webhooks should append replies to the matching transaction thread.</li>
          <li><strong>Documents:</strong> store PDFs and forms in S3-compatible storage or Supabase Storage with immutable audit records.</li>
          <li><strong>Scale:</strong> move workflow templates into versioned database tables, add role permissions, add event logs, and keep jurisdiction rules editable by an admin.</li>
        </ul>
      </div>
      <div class="panel">
        <div class="panel-header">
          <div>
            <p class="section-kicker">Domain</p>
            <h3>Connect a Domain</h3>
          </div>
        </div>
        <ul class="deploy-list">
          <li>Choose a host for the static app, such as Cloudflare Pages, Netlify, Vercel, or a low-cost VPS with Nginx.</li>
          <li>Upload this folder or connect a GitHub repo. Build command can stay blank for this static version; publish directory is the project root.</li>
          <li>In the host dashboard, add your domain, for example <code>app.yourdomain.com</code>.</li>
          <li>At your DNS provider, create the CNAME or A record the host gives you. For Cloudflare Pages this is usually a CNAME from <code>app</code> to the generated Pages hostname.</li>
          <li>Enable HTTPS in the host dashboard. Most hosts issue the certificate automatically after DNS validates.</li>
          <li>When Google Workspace email is added, configure OAuth consent, SPF, DKIM, DMARC, and backend token storage before sending client mail from the domain.</li>
        </ul>
      </div>
    </section>
  `;
}

function bindDynamicEvents() {
  document.querySelectorAll("[data-select-transaction]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedId = button.dataset.selectTransaction;
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-jump-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.jumpView;
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-open-new]").forEach((button) => {
    button.addEventListener("click", openTransactionModal);
  });

  document.querySelectorAll("[data-task-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.taskFilter = button.dataset.taskFilter;
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-toggle-task]").forEach((button) => {
    button.addEventListener("click", () => {
      const [txId, taskId] = button.dataset.toggleTask.split(":");
      updateTaskStatus(txId, taskId, null);
    });
  });

  document.querySelectorAll("[data-set-task]").forEach((button) => {
    button.addEventListener("click", () => {
      const [txId, taskId, status] = button.dataset.setTask.split(":");
      updateTaskStatus(txId, taskId, status);
    });
  });

  document.querySelectorAll("[data-party-status]").forEach((button) => {
    button.addEventListener("click", () => {
      const [txId, buyerId, status] = button.dataset.partyStatus.split(":");
      setBuyerStatus(txId, buyerId, status);
    });
  });

  document.querySelectorAll("[data-reset-buyers]").forEach((button) => {
    button.addEventListener("click", () => resetBuyers(button.dataset.resetBuyers));
  });

  document.querySelectorAll("[data-add-buyer]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      addBuyer(form.dataset.addBuyer, new FormData(form));
    });
  });

  document.querySelectorAll("[data-property-media]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      updatePropertyMedia(form.dataset.propertyMedia, new FormData(form));
    });
  });

  document.querySelectorAll("[data-comment-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      addComment(form.dataset.commentForm, new FormData(form));
    });
  });

  document.querySelectorAll("[data-calendar-draft]").forEach((button) => {
    button.addEventListener("click", () => openCalendarDraft(button.dataset.calendarDraft));
  });

  document.querySelectorAll("[data-gmail-draft]").forEach((button) => {
    button.addEventListener("click", () => openGmailDraft(button.dataset.gmailDraft));
  });

  document.querySelectorAll("[data-log-integration]").forEach((button) => {
    button.addEventListener("click", () => {
      const [txId, kind] = button.dataset.logIntegration.split(":");
      logIntegrationPreview(txId, kind);
    });
  });

  document.querySelectorAll("[data-link-google]").forEach((button) => {
    button.addEventListener("click", linkGoogleAccount);
  });

  document.querySelectorAll("[data-copy-guest-link]").forEach((button) => {
    button.addEventListener("click", () => copyGuestLink(button.dataset.copyGuestLink));
  });

  document.querySelectorAll("[data-switch-account]").forEach((button) => {
    button.addEventListener("click", () => switchAccount(button.dataset.switchAccount));
  });

  document.querySelectorAll("[data-delete-rule]").forEach((button) => {
    button.addEventListener("click", () => deleteCustomRule(button.dataset.deleteRule));
  });

  const ruleForm = document.querySelector("#ruleForm");
  if (ruleForm) {
    ruleForm.addEventListener("submit", (event) => {
      event.preventDefault();
      addCustomRule(new FormData(ruleForm));
    });
  }

  const leadForm = document.querySelector("#leadForm");
  if (leadForm) {
    leadForm.addEventListener("submit", (event) => {
      event.preventDefault();
      addLead(new FormData(leadForm));
    });
  }

  document.querySelectorAll("[data-lead-status]").forEach((select) => {
    select.addEventListener("change", () => updateLeadStatus(select.dataset.leadStatus, select.value));
  });

  document.querySelectorAll("[data-retry-lead]").forEach((button) => {
    button.addEventListener("click", () => retryLeadIntegrations(button.dataset.retryLead));
  });

  const guestForm = document.querySelector("#guestForm");
  if (guestForm) {
    guestForm.addEventListener("submit", (event) => {
      event.preventDefault();
      createGuestAccount(new FormData(guestForm));
    });
  }

  const provisionUserForm = document.querySelector("#provisionUserForm");
  if (provisionUserForm) {
    provisionUserForm.addEventListener("submit", (event) => {
      event.preventDefault();
      provisionUser(new FormData(provisionUserForm));
    });
  }

  const runAudit = document.querySelector("#runAudit");
  if (runAudit) {
    runAudit.addEventListener("click", saveAuditSnapshot);
  }

  const messageForm = document.querySelector("#messageForm");
  if (messageForm) {
    messageForm.addEventListener("submit", (event) => {
      event.preventDefault();
      logMessage(new FormData(messageForm));
    });

    messageForm.template.addEventListener("change", () => {
      const tx = selectedTransaction();
      const template = MESSAGE_TEMPLATES[messageForm.template.value];
      messageForm.subject.value = `[${tx.code}] ${fillTemplate(template.subject, tx)}`;
      messageForm.body.value = fillTemplate(template.body, tx);
    });

    document.querySelector("#openMailto")?.addEventListener("click", () => {
      const data = new FormData(messageForm);
      const href = `mailto:${encodeURIComponent(data.get("to"))}?subject=${encodeURIComponent(data.get("subject"))}&body=${encodeURIComponent(data.get("body"))}`;
      window.location.href = href;
    });
  }

  const loginForm = document.querySelector("#loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      loginToBackend(new FormData(loginForm));
    });
  }

  document.querySelectorAll("[data-auth-panel]").forEach((button) => {
    button.addEventListener("click", () => showAuthPanel(button.dataset.authPanel));
  });

  const accountRequestForm = document.querySelector("[data-account-request]");
  if (accountRequestForm) {
    accountRequestForm.addEventListener("submit", (event) => {
      event.preventDefault();
      requestAccount(new FormData(accountRequestForm));
    });
  }

  const passwordResetForm = document.querySelector("[data-password-reset]");
  if (passwordResetForm) {
    passwordResetForm.addEventListener("submit", (event) => {
      event.preventDefault();
      requestPasswordReset(new FormData(passwordResetForm));
    });
  }

  const guestAccessForm = document.querySelector("[data-guest-access]");
  if (guestAccessForm) {
    guestAccessForm.addEventListener("submit", (event) => {
      event.preventDefault();
      openGuestTimelineFromForm(new FormData(guestAccessForm));
    });
  }
}

function updateTaskStatus(txId, taskId, forcedStatus) {
  if (!isAgent()) return;
  const tx = state.transactions.find((item) => item.id === txId);
  const task = tx?.tasks.find((item) => item.id === taskId);
  if (!task) return;
  const cycle = ["todo", "active", "done"];
  task.status = forcedStatus || cycle[(cycle.indexOf(task.status) + 1) % cycle.length];
  saveState();
  render();
}

function addBuyer(txId, formData) {
  if (!isAgent()) return;
  const tx = state.transactions.find((item) => item.id === txId);
  if (!tx) return;
  const buyer = {
    id: makeId("buyer"),
    name: formData.get("name"),
    email: formData.get("email"),
    status: formData.get("status")
  };
  tx.buyers.push(buyer);
  tx.messages.unshift(systemMessage(tx, "Buyer added", `${buyer.name} was added as a ${buyer.status} buyer candidate.`));
  state.accounts.push({
    id: `acct-${buyer.id}`,
    name: buyer.name,
    email: buyer.email,
    role: "buyer",
    label: "Guest buyer",
    transactionIds: [tx.id]
  });
  state.accounts = dedupeAccounts(state.accounts);
  saveState();
  render();
}

function setBuyerStatus(txId, buyerId, status) {
  if (!isAgent()) return;
  const tx = state.transactions.find((item) => item.id === txId);
  const buyer = tx?.buyers.find((item) => item.id === buyerId);
  if (!buyer) return;
  buyer.status = status;
  tx.messages.unshift(systemMessage(tx, "Buyer status updated", `${buyer.name} is now marked ${status}.`));
  saveState();
  render();
}

function resetBuyers(txId) {
  if (!isAgent()) return;
  const tx = state.transactions.find((item) => item.id === txId);
  if (!tx) return;
  tx.buyers.forEach((buyer) => {
    buyer.status = "removed";
  });
  tx.messages.unshift(systemMessage(tx, "Buyer roster reset", "All buyer candidates were marked removed. Add a new active buyer when circumstances change."));
  saveState();
  render();
}

function updatePropertyMedia(txId, formData) {
  if (!isAgent()) return;
  const tx = state.transactions.find((item) => item.id === txId);
  if (!tx) return;
  tx.media ||= {};
  tx.media.photoUrl = String(formData.get("photoUrl") || "").trim();
  tx.media.tourUrl = String(formData.get("tourUrl") || "").trim();
  tx.messages.unshift(systemMessage(tx, "Property media updated", "The listing photo or virtual tour link was updated for this transaction."));
  saveState();
  render();
}

async function addLead(formData) {
  if (!isAgent()) return;
  const payload = {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    source: String(formData.get("source") || "").trim(),
    leadType: formData.get("leadType"),
    propertyAddress: String(formData.get("propertyAddress") || "").trim(),
    jurisdiction: String(formData.get("jurisdiction") || "").trim() || null,
    notes: String(formData.get("notes") || "").trim()
  };
  const status = document.querySelector("#leadFormStatus");
  if (!payload.email && !payload.phone) {
    if (status) status.textContent = "Add an email address or phone number before saving the lead.";
    return;
  }

  if (backendSession && backendMode === "spring") {
    try {
      const lead = mapSpringLead(await apiFetch("/api/leads", {
        method: "POST",
        body: JSON.stringify(payload)
      }));
      state.leads = [lead, ...(state.leads || []).filter((item) => item.id !== lead.id)];
      render();
      return;
    } catch (error) {
      if (status) status.textContent = error.message || "The lead could not be saved.";
      return;
    }
  }

  const lead = {
    id: makeId("lead"),
    ...payload,
    leadType: String(payload.leadType).toLowerCase(),
    status: "new",
    airtableSyncStatus: "not_configured",
    makeDeliveryStatus: "not_configured",
    createdAt: new Date().toISOString()
  };
  state.leads = [lead, ...(state.leads || [])];
  saveState();
  render();
}

async function updateLeadStatus(leadId, statusValue) {
  if (!isAgent()) return;
  const lead = (state.leads || []).find((item) => item.id === leadId);
  if (!lead) return;
  if (backendSession && backendMode === "spring") {
    try {
      const updated = mapSpringLead(await apiFetch(`/api/leads/${encodeURIComponent(leadId)}`, {
        method: "PATCH",
        body: JSON.stringify({ status: String(statusValue).toUpperCase() })
      }));
      state.leads = state.leads.map((item) => item.id === leadId ? updated : item);
      render();
      return;
    } catch (error) {
      alert(error.message || "The lead status could not be updated.");
    }
    return;
  }
  lead.status = statusValue;
  saveState();
  render();
}

async function retryLeadIntegrations(leadId) {
  if (!isAgent() || !backendSession || backendMode !== "spring") return;
  try {
    const updated = mapSpringLead(await apiFetch(`/api/leads/${encodeURIComponent(leadId)}/retry-integrations`, {
      method: "POST"
    }));
    state.leads = state.leads.map((item) => item.id === leadId ? updated : item);
    render();
  } catch (error) {
    alert(error.message || "The integrations could not be retried.");
  }
}

function addComment(txId, formData) {
  const tx = state.transactions.find((item) => item.id === txId);
  if (!tx || !canViewTransaction(tx)) return;
  const user = currentUser();
  const body = String(formData.get("body") || "").trim();
  if (!body) return;

  if (backendSession) {
    apiFetch(`/api/transactions/${encodeURIComponent(txId)}/comments`, {
      method: "POST",
      body: JSON.stringify({ body })
    })
      .then((payload) => {
        state = upgradeState(payload.state);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        render();
      })
      .catch((error) => {
        console.warn("Comment sync failed", error);
      });
    return;
  }

  tx.messages.unshift({
    id: makeId("msg"),
    channel: "comment",
    direction: "inbound",
    visibility: "client",
    status: "posted",
    author: user.name,
    subject: `${roleLabel(user.role)} comment`,
    to: "Transaction team",
    createdAt: new Date().toISOString(),
    body,
    relatedTaskId: null
  });
  saveState();
  render();
}

function logMessage(formData) {
  if (!isAgent()) return;
  const tx = selectedTransaction();
  tx.messages.unshift({
    id: makeId("msg"),
    channel: "email",
    direction: "outbound",
    visibility: "client",
    status: "logged",
    author: currentUser().name,
    subject: formData.get("subject"),
    to: formData.get("to"),
    body: formData.get("body"),
    createdAt: new Date().toISOString(),
    relatedTaskId: null
  });
  saveState();
  render();
}

function systemMessage(tx, subject, body) {
  return {
    id: makeId("msg"),
    channel: "comment",
    direction: "internal",
    visibility: "client",
    status: "logged",
    author: currentUser()?.name || "System",
    subject,
    to: "Transaction team",
    createdAt: new Date().toISOString(),
    body,
    relatedTaskId: null
  };
}

function addCustomRule(formData) {
  if (!isAgent()) return;
  const rule = {
    id: makeId("custom-rule"),
    title: formData.get("title"),
    jurisdiction: formData.get("jurisdiction"),
    owner: formData.get("owner"),
    phase: formData.get("phase"),
    basis: formData.get("basis"),
    days: Number(formData.get("days")),
    priority: formData.get("priority"),
    propertyType: formData.get("propertyType"),
    note: formData.get("note"),
    sourceUrl: formData.get("sourceUrl"),
    createdAt: new Date().toISOString()
  };
  state.customRules.push(rule);
  state.transactions.forEach((tx) => {
    tx.tasks = mergeGeneratedTasks(tx, tx.tasks);
  });
  saveState();
  render();
}

function deleteCustomRule(ruleId) {
  if (!isAgent()) return;
  state.customRules = state.customRules.filter((rule) => rule.id !== ruleId);
  state.transactions.forEach((tx) => {
    tx.tasks = mergeGeneratedTasks(tx, tx.tasks).filter((task) => task.id !== ruleId);
  });
  saveState();
  render();
}

function createGuestAccount(formData) {
  if (!isAgent()) return;
  state.accounts.push({
    id: makeId("acct"),
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    label: `Guest ${formData.get("role")}`,
    transactionIds: [formData.get("transactionId")]
  });
  state.accounts = dedupeAccounts(state.accounts);
  saveState();
  render();
}

async function provisionUser(formData) {
  if (!backendSession || backendMode !== "spring" || !isAgent()) return;
  const status = document.querySelector("#userProvisionStatus");
  const payload = {
    displayName: String(formData.get("displayName") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    role: formData.get("role"),
    temporaryPassword: String(formData.get("temporaryPassword") || "")
  };
  try {
    const created = mapSpringUser(await apiFetch("/api/users", {
      method: "POST",
      body: JSON.stringify(payload)
    }));
    state.users = [created, ...(state.users || [])];
    render();
  } catch (error) {
    if (status) status.textContent = error.message || "The portal account could not be created.";
  }
}

function switchAccount(accountId) {
  state.currentUserId = accountId;
  ensureSelectedIsVisible();
  saveState();
  render();
}

function saveAuditSnapshot() {
  const results = computeAuditResults();
  const missing = results.filter((result) => result.status === "missing").length;
  const warn = results.filter((result) => result.status === "warn").length;
  state.auditRuns.unshift({
    id: makeId("audit"),
    createdAt: new Date().toISOString(),
    summary: `${missing} missing and ${warn} warning item${warn === 1 ? "" : "s"}`,
    notes: "Snapshot compares configured workflow rule IDs against the source checklist embedded in this prototype."
  });
  saveState();
  render();
}

function openCalendarDraft(txId) {
  const tx = state.transactions.find((item) => item.id === txId);
  if (!tx || !canViewTransaction(tx)) return;
  window.open(buildCalendarUrl(tx), "_blank", "noopener");
}

function openGmailDraft(txId) {
  const tx = state.transactions.find((item) => item.id === txId);
  if (!tx || !canViewTransaction(tx) || !isAgent()) return;
  window.open(buildGmailUrl(tx), "_blank", "noopener");
}

function logIntegrationPreview(txId, kind) {
  if (!isAgent()) return;
  const tx = state.transactions.find((item) => item.id === txId);
  if (!tx) return;
  tx.messages.unshift(systemMessage(
    tx,
    kind === "calendar" ? "Calendar draft prepared" : "Gmail draft prepared",
    kind === "calendar"
      ? "Scheduling draft was prepared for Google Calendar. Production mode should create this through OAuth and Calendar API events."
      : "Email draft was prepared for Gmail. Production mode should send through OAuth, Gmail API, and a server-side queue."
  ));
  saveState();
  render();
}

async function linkGoogleAccount() {
  if (!backendSession) {
    alert("Sign in through the Spring backend before linking Google Workspace.");
    return;
  }
  try {
    const payload = await apiFetch("/api/integrations/google/authorize");
    window.location.href = payload.authorizationUrl;
  } catch (error) {
    alert(error.message || "Google account linking is not configured yet.");
  }
}

async function copyGuestLink(txId) {
  const tx = state.transactions.find((item) => item.id === txId);
  if (!tx?.guestToken) return;
  const link = `${window.location.origin}${window.location.pathname}?guest=${encodeURIComponent(tx.guestToken)}`;
  try {
    await navigator.clipboard.writeText(link);
    alert("Guest timeline link copied.");
  } catch (error) {
    window.prompt("Guest timeline link", link);
  }
}

function buildCalendarUrl(tx) {
  const start = addDays(tx.closingDate, -1).replaceAll("-", "");
  const end = tx.closingDate.replaceAll("-", "");
  const details = [
    `${tx.code} - ${tx.address}`,
    `Client: ${primaryRecipient(tx)}`,
    `Stage: ${tx.stage}`,
    `Target close: ${formatDate(tx.closingDate)}`
  ].join("\n");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Property event: ${tx.address}`,
    dates: `${start}T140000/${start}T150000`,
    details,
    location: tx.address
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildGmailUrl(tx) {
  const template = MESSAGE_TEMPLATES.kickoff;
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: primaryEmail(tx),
    su: `[${tx.code}] ${fillTemplate(template.subject, tx)}`,
    body: fillTemplate(template.body, tx)
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

function googleMapsSearchUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function googleMapsEmbedUrl(address) {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}

function streetViewImageUrl(address) {
  const base = API_BASE || "";
  return `${base}/api/properties/street-view?address=${encodeURIComponent(address)}&width=640&height=360`;
}

function groupByPhase(tasks) {
  return tasks.reduce((groups, task) => {
    groups[task.phase] ||= [];
    groups[task.phase].push(task);
    return groups;
  }, {});
}

function fillTemplate(template, tx) {
  return template
    .replaceAll("{{client}}", primaryRecipient(tx))
    .replaceAll("{{address}}", tx.address)
    .replaceAll("{{closingDate}}", formatDate(tx.closingDate));
}

function activeBuyers(tx) {
  return tx.buyers.filter((buyer) => buyer.status === "active");
}

function primaryRecipient(tx) {
  if (tx.role === "buyer" && tx.buyers[0]) return tx.buyers[0].name;
  if (tx.role === "seller" && tx.sellers[0]) return tx.sellers[0].name;
  return activeBuyers(tx)[0]?.name || tx.sellers[0]?.name || tx.client;
}

function primaryEmail(tx) {
  if (tx.role === "buyer" && tx.buyers[0]?.email) return tx.buyers[0].email;
  if (tx.role === "seller" && tx.sellers[0]?.email) return tx.sellers[0].email;
  return activeBuyers(tx)[0]?.email || tx.sellers[0]?.email || tx.contactEmail || "";
}

function dedupeAccounts(accounts) {
  const seen = new Map();
  accounts.forEach((account) => {
    const key = account.email ? account.email.toLowerCase() : account.id;
    if (!seen.has(key)) {
      seen.set(key, account);
    } else {
      const existing = seen.get(key);
      existing.transactionIds = Array.from(new Set([...(existing.transactionIds || []), ...(account.transactionIds || [])]));
    }
  });
  return Array.from(seen.values());
}

function daysUntil(dateString) {
  const target = new Date(`${dateString}T00:00:00`);
  const today = startOfToday();
  return Math.round((target - today) / 86400000);
}

function daysSince(dateString) {
  const target = new Date(`${dateString}T00:00:00`);
  const today = startOfToday();
  return Math.round((today - target) / 86400000);
}

function dueLabel(dateString) {
  const diff = daysUntil(dateString);
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `${formatDate(dateString)} - ${diff}d`;
}

function renderBadge(text, tone = "") {
  return `<span class="badge ${tone}">${escapeHtml(String(text))}</span>`;
}

function renderEmpty(text) {
  return `<div class="empty-state">${escapeHtml(text)}</div>`;
}

function formatDate(dateString) {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(`${dateString}T12:00:00`)
  );
}

function formatDateTime(dateString) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(dateString));
}

function capitalize(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatCurrency(value) {
  if (!value) return "Price TBD";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function roleLabel(role) {
  return {
    seller: "Seller",
    buyer: "Buyer",
    agent: "Agent",
    admin: "Administrator",
    viewer: "Guest Viewer",
    access: "Access"
  }[role] || role;
}

function jurisdictionName(jurisdiction) {
  return {
    MD: "Maryland",
    DC: "District of Columbia",
    VA: "Virginia"
  }[jurisdiction] || jurisdiction;
}

function propertyTypeLabel(type) {
  return {
    "single-family": "Single family",
    condo: "Condo",
    townhome: "Townhome / HOA",
    "multi-unit": "2-4 unit"
  }[type] || type;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("\n", " ");
}

function openTransactionModal() {
  if (!isAgent()) return;
  const modal = document.querySelector("#transactionModal");
  const form = document.querySelector("#transactionForm");
  const today = new Date().toISOString().slice(0, 10);
  form.reset();
  form.contractDate.value = today;
  form.closingDate.value = addDays(today, 35);
  modal.showModal();
}

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    state.view = button.dataset.view;
    saveState();
    render();
  });
});

document.querySelector("#accountSelect")?.addEventListener("change", (event) => {
  if (backendSession) return;
  switchAccount(event.target.value);
});

document.querySelector("#logoutButton").addEventListener("click", logoutFromBackend);
document.querySelector("#openNewTransaction").addEventListener("click", openTransactionModal);
document.querySelector("#closeTransactionModal").addEventListener("click", () => document.querySelector("#transactionModal").close());
document.querySelector("#cancelTransaction").addEventListener("click", () => document.querySelector("#transactionModal").close());

document.querySelector("#transactionForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!isAgent()) return;
  const data = new FormData(event.currentTarget);
  const tx = createTransaction({
    address: data.get("address"),
    client: data.get("client"),
    contactEmail: data.get("contactEmail"),
    jurisdiction: data.get("jurisdiction"),
    role: data.get("role"),
    propertyType: data.get("propertyType"),
    stage: data.get("stage"),
    contractDate: data.get("contractDate"),
    closingDate: data.get("closingDate"),
    builtYear: data.get("builtYear"),
    price: data.get("price"),
    photoUrl: data.get("photoUrl"),
    tenantOccupied: data.has("tenantOccupied"),
    financing: data.has("financing")
  });

  state.transactions.unshift(tx);
  state.accounts = dedupeAccounts([...state.accounts, ...defaultAccounts([tx]).filter((account) => account.role !== "agent")]);
  state.selectedId = tx.id;
  state.view = "dashboard";
  saveState();
  document.querySelector("#transactionModal").close();
  render();
});

document.querySelector("#searchInput").addEventListener("input", (event) => {
  state.search = event.target.value;
  saveState();
  render();
});

document.querySelector("#exportData").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `champion-crm-export-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
});

document.querySelector("#resetData").addEventListener("click", () => {
  if (!confirm("Reset local demo data? This clears the browser copy for this app.")) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_STORAGE_KEY);
  state = seedState();
  saveState();
  render();
});

document.querySelector("#searchInput").value = state.search;
bootstrapApp();
