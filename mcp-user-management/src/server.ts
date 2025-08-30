import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpServer } from "./mcp/server.js";
import config from "./config/index.js";
import { logger } from "./utils/logger.js";

async function main() {
  try {
    logger.info("Starting MCP User Management Server", {
      name: config.MCP_SERVER_NAME,
      version: config.MCP_SERVER_VERSION,
      environment: config.NODE_ENV,
    });

    const server = createMcpServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);

    logger.info(
      "MCP Server successfully started and connected to stdio transport"
    );
  } catch (error) {
    logger.error("Failed to start MCP server", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  }
}

process.on("SIGINT", () => {
  logger.info("Received SIGINT, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.info("Received SIGTERM, shutting down gracefully...");
  process.exit(0);
});

process.on("uncaughtException", error => {
  logger.error("Uncaught exception", {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

process.on("unhandledRejection", reason => {
  logger.error("Unhandled promise rejection", {
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined,
  });
  process.exit(1);
});

main().catch(error => {
  logger.error("Fatal error in main()", {
    error: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
  });
  process.exit(1);
});
