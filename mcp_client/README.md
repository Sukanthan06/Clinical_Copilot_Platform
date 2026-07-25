# Clinical Copilot MCP Client

This is the production-grade Python Model Context Protocol (MCP) Client for the **Clinical Copilot** platform. It establishes a secure Server-Sent Events (SSE) transport connection to the remote MCP server deployed on NitroCloud and exposes validated, type-safe API wrapper tools to the FastAPI backend.

---

## 📁 Package Structure

```
mcp_client/
├── config.py         # Configuration loader via pydantic-settings
├── exceptions.py     # Custom exception classes (MCPConnectionError, MCPToolError, MCPTimeoutError)
├── schemas.py        # Pydantic v2 schemas validating request/response shapes
├── client.py         # Asynchronous MCPClient core managing lifecycles and reconnects
└── tools.py          # Decoupled wrappers isolating backend routes from tool-name strings
```

---

## ⚙️ Configuration

Set the environment variables in your active `.env` file at the repository root:

- `MCP_SERVER_URL`: The Server-Sent Events (SSE) endpoint of your deployed NitroCloud MCP Server.
- `REQUEST_TIMEOUT`: Float representing the maximum execution duration in seconds for any tool call (default `30.0`).
- `DEBUG`: Boolean flag toggling debugging configurations.

---

## 🚀 Basic Usage Example

### 1. Initialize and Manage connection
```python
from mcp_client.client import MCPClient

mcp_client = MCPClient()

# Connect during application bootstrap
await mcp_client.connect()

# Check health
health_status = await mcp_client.health()
print(health_status)  # {"status": "healthy", "mcp": "connected"}

# Disconnect on shutdown
await mcp_client.disconnect()
```

### 2. Invoke Wrapper Tools
```python
from mcp_client.tools import authenticate_user

response = await authenticate_user(
    client=mcp_client,
    username="DrHouse",
    password="lupus-is-never-the-answer",
    action="login"
)

print(response.success)
print(response.token)
```

---

## 🛡️ Exception Handlers

The client guarantees encapsulation by intercepting raw protocol issues and raising standardized exceptions:

- **`MCPConnectionError`**: Connection fails, drops, or transport handshake issues occur.
- **`MCPTimeoutError`**: Tool execution exceeds `REQUEST_TIMEOUT`.
- **`MCPToolError`**: Tool fails internally or returns an execution error state.
