"""Diagnose the configured NitroCloud MCP connection from the terminal."""

import asyncio
import os
import sys
import traceback
from contextlib import AsyncExitStack
from pathlib import Path

from dotenv import load_dotenv
from mcp import ClientSession
from mcp.client.sse import sse_client


async def main() -> int:
    project_root = Path(__file__).resolve().parent
    load_dotenv(project_root / ".env", override=True)

    endpoint = os.getenv("MCP_SERVER_URL", "").strip()
    if not endpoint:
        print("MCP_SERVER_URL is missing from .env")
        return 2

    print(f"Connecting to: {endpoint}")
    print("Transport: raw SSE")

    try:
        async with AsyncExitStack() as stack:
            async with asyncio.timeout(20):
                read_stream, write_stream = await stack.enter_async_context(
                    sse_client(endpoint)
                )
                session = await stack.enter_async_context(
                    ClientSession(read_stream, write_stream)
                )
                result = await session.initialize()
                tools = await session.list_tools()

            print("MCP connection successful.")
            print(f"Server: {result.server_info.name} {result.server_info.version}")
            print("Tools available:")
            for tool in tools.tools:
                print(f"- {tool.name}")
            return 0
    except Exception as exc:
        print(f"MCP connection failed: {type(exc).__name__}: {exc}", file=sys.stderr)
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
