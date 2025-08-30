import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import config from "../config/index.js";
import { logger } from "../utils/logger.js";
import {
  CreateUserToolSchema,
  UpdateUserToolSchema,
  DeleteUserToolSchema,
  GetUserToolSchema,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
  handleGetUser,
} from "./tools.js";
import { resourcesConfig, userDetailsTemplate } from "./resources.js";
import {
  GenerateFakeUserPromptSchema,
  GenerateUserReportPromptSchema,
  GenerateUserListPromptSchema,
  handleGenerateFakeUser,
  handleGenerateUserReport,
  handleGenerateUserList,
} from "./prompts.js";

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: config.MCP_SERVER_NAME,
    version: config.MCP_SERVER_VERSION,
    capabilities: {
      resources: {},
      tools: {},
    },
  });

  server.resource(
    resourcesConfig.users.name,
    resourcesConfig.users.uri,
    {
      description: resourcesConfig.users.description,
      title: resourcesConfig.users.title,
      mimeType: resourcesConfig.users.mimeType,
    },
    resourcesConfig.users.handler
  );

  server.resource(
    resourcesConfig.userDetails.name,
    userDetailsTemplate,
    {
      description: resourcesConfig.userDetails.description,
      title: resourcesConfig.userDetails.title,
      mimeType: resourcesConfig.userDetails.mimeType,
    },
    resourcesConfig.userDetails.handler
  );

  server.tool(
    "create-user",
    "Create a new user in the database",
    CreateUserToolSchema,
    {
      title: "Create User",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
    handleCreateUser
  );

  server.tool(
    "update-user",
    "Update an existing user in the database",
    UpdateUserToolSchema,
    {
      title: "Update User",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
    handleUpdateUser
  );

  server.tool(
    "delete-user",
    "Delete a user from the database",
    DeleteUserToolSchema,
    {
      title: "Delete User",
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
      openWorldHint: true,
    },
    handleDeleteUser
  );

  server.tool(
    "get-user",
    "Get a specific user by ID",
    GetUserToolSchema,
    {
      title: "Get User",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    handleGetUser
  );

  server.prompt(
    "generate-fake-user",
    "Generate fake user based on given name",
    GenerateFakeUserPromptSchema,
    handleGenerateFakeUser
  );

  server.prompt(
    "generate-user-report",
    "Generate a detailed report for a specific user",
    GenerateUserReportPromptSchema,
    handleGenerateUserReport
  );

  server.prompt(
    "generate-user-list",
    "Generate a formatted list of users",
    GenerateUserListPromptSchema,
    handleGenerateUserList
  );

  logger.info(
    "MCP Server created with all tools, resources, and prompts registered"
  );

  return server;
}
