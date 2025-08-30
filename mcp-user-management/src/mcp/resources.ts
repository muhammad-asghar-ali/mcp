import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { userService } from "../services/userService.js";
import { logger } from "../utils/logger.js";

export async function handleGetAllUsers(uri: URL) {
  try {
    logger.info("Handling get all users resource request");
    const users = await userService.getAllUsers();

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(users, null, 2),
          mimeType: "application/json",
        },
      ],
    };
  } catch (error) {
    logger.error("Failed to handle get all users resource", {
      error: error instanceof Error ? error.message : error,
    });
    throw new Error("Failed to retrieve users data");
  }
}

export async function handleGetUserById(uri: URL) {
  try {
    const id = uri.searchParams.get("id");
    if (!id) {
      throw new Error("ID parameter is required");
    }

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new Error("Invalid ID parameter - must be a number");
    }

    logger.info(`Handling get user by ID resource request for ID: ${userId}`);

    const user = await userService.getUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(user, null, 2),
          mimeType: "application/json",
        },
      ],
    };
  } catch (error) {
    logger.error("Failed to handle get user by ID resource", {
      uri: uri.href,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}

export const userDetailsTemplate = new ResourceTemplate(
  "users://{id}/profile",
  {
    list: undefined,
  }
);

export const resourcesConfig = {
  users: {
    name: "users",
    uri: "users://all",
    description: "Get all user data from database",
    title: "Users",
    mimeType: "application/json",
    handler: handleGetAllUsers,
  },
  userDetails: {
    name: "users-details",
    template: userDetailsTemplate,
    description: "Get user detail data from database",
    title: "User Details",
    mimeType: "application/json",
    handler: handleGetUserById,
  },
};
