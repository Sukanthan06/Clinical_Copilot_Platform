import logging
import sys

def setup_logging(log_level: str = "INFO") -> None:
    """Configures the standard Python logging framework."""
    logging.basicConfig(
        level=log_level.upper(),
        format="[%(asctime)s] %(levelname)s in %(module)s: %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ],
        force=True
    )
    logger = logging.getLogger("backend")
    logger.info("Logging configured with level %s", log_level)
