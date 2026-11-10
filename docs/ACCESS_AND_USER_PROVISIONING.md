# Access And User Provisioning

The Access section provisions real Spring database users when the app is running in Spring mode.

Default policy:

- Administrators can create administrator, agent, buyer, and seller accounts.
- Agents can create buyer and seller accounts.
- Agents cannot create administrator or agent accounts.
- Buyers and sellers cannot provision accounts.

The same policy is enforced in `POST /api/users`; hiding role options in the browser is only a convenience and is not the security boundary.

## Future change

When agent-to-agent provisioning is approved, set this backend environment variable to true and restart Spring:

```text
ALLOW_AGENT_AGENT_PROVISIONING=true
```

That permits agents to create `AGENT` accounts while administrators remain the only role allowed to create `ADMIN` accounts. The default remains `false`.
