from pydantic_settings import BaseSettings, SettingsConfigDict

class MCPConfig(BaseSettings):
    """
    Validates and loads environment configurations for the MCP Client.
    """
    MCP_SERVER_URL: str = "http://localhost:8000/sse"
    REQUEST_TIMEOUT: float = 30.0
    DEBUG: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

config = MCPConfig()
