import logging
from contextlib import asynccontextmanager
from typing import Any, Dict
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from backend.config import settings
from backend.utils.logging import setup_logging
from backend.middleware.error_handler import setup_exception_handlers
from backend.services import mcp_client

# Import routers
from backend.routes.auth import router as auth_router
from backend.routes.patient import router as patient_router
from backend.routes.timeline import router as timeline_router
from backend.routes.trials import router as trials_router
from backend.routes.referral import router as referral_router
from backend.routes.extraction import router as extraction_router
from backend.routes.chat import router as chat_router

# Configure logging before anything else
setup_logging(settings.LOG_LEVEL)
logger = logging.getLogger("backend.app")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manages the application lifecycle.
    Establishes connection to the MCP server on startup and cleans up on shutdown.
    """
    logger.info("Initializing FastAPI application...")
    try:
        tool_names = await mcp_client.verify_connection()
        logger.info("MCP readiness check passed. Tools: %s", ", ".join(tool_names))
    except Exception as e:
        logger.error("Failed to connect to MCP Server during startup: %s", e)
    
    yield
    
    logger.info("Shutting down FastAPI application...")
    await mcp_client.disconnect()

# Initialize FastAPI App
app = FastAPI(
    title=settings.APP_NAME,
    description="API Gateway for the Clinical Copilot Platform connecting to NitroCloud MCP Server.",
    version="1.0.0",
    lifespan=lifespan,
    debug=settings.DEBUG
)

# Setup CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Centralized Exception Handlers
setup_exception_handlers(app)

# Include Routers
app.include_router(auth_router)
app.include_router(patient_router)
app.include_router(extraction_router)
app.include_router(timeline_router)
app.include_router(trials_router)
app.include_router(referral_router)
app.include_router(chat_router)

@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check() -> Dict[str, Any]:
    """
    Health check endpoint that verifies the live MCP session when needed.
    """
    mcp_error = None
    if not mcp_client.is_connected():
        try:
            await mcp_client.verify_connection()
        except Exception as exc:
            mcp_error = str(exc)

    mcp_status = "connected" if mcp_client.is_connected() else "disconnected"
    logger.debug("Health check requested. MCP status: %s", mcp_status)
    response = {
        "status": "healthy",
        "mcp": mcp_status
    }
    if mcp_error:
        response["mcp_error"] = mcp_error
    return response
