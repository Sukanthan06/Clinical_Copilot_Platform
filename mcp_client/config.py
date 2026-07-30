from pathlib import Path

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

# Keep the gateway configuration consistent with the connection diagnostic.
# In particular, avoid a stale system-level MCP_SERVER_URL overriding the
# project endpoint in .env.
load_dotenv(Path(__file__).resolve().parents[1] / ".env", override=True)

class MCPConfig(BaseSettings):
    """
    Validates and loads environment configurations for the MCP Client.
    """
    MCP_SERVER_URL: str = "http://localhost:8000/sse"
    MCP_TIMEOUT: float = 60.0
    DEBUG: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

config = MCPConfig()
