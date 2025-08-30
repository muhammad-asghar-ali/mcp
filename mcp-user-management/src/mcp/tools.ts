import { z } from "zod";
import { userService } from "../services/userService.js";
import { logger } from "../utils/logger.js";

export const CreateUserToolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
});

export const UpdateUserToolSchema = z.object({
  id: z.number().int().positive("ID must be a positive integer"),
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email format").optional(),
  address: z.string().min(1, "Address is required").optional(),
  phone: z.string().min(1, "Phone number is required").optional(),
});

export const DeleteUserToolSchema = z.object({
  id: z.number().int().positive("ID must be a positive integer"),
});

export const GetUserToolSchema = z.object({
  id: z.number().int().positive("ID must be a positive integer"),
});

export async function handleCreateUser(
  params: z.infer<typeof CreateUserToolSchema>
) {
  try {
    logger.info("Creating user via MCP tool", { params });

    const user = await userService.createUser(params);

    return {
      content: [
        {
          type: "text",
          text: `User "${user.name}" created successfully with ID ${user.id}`,
        },
      ],
    };
  } catch (error) {
    logger.error("Failed to create user via MCP tool", {
      params,
      error: error instanceof Error ? error.message : error,
    });

    return {
      content: [
        {
          type: "text",
          text: `Failed to create user: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
    };
  }
}

export async function handleUpdateUser(
  params: z.infer<typeof UpdateUserToolSchema>
) {
  try {
    logger.info("Updating user via MCP tool", { params });

    const { id, ...updateData } = params;
    const user = await userService.updateUser(id, updateData);

    if (!user) {
      return {
        content: [
          {
            type: "text",
            text: `User with ID ${id} not found`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `User "${user.name}" (ID: ${id}) updated successfully`,
        },
      ],
    };
  } catch (error) {
    logger.error("Failed to update user via MCP tool", {
      params,
      error: error instanceof Error ? error.message : error,
    });

    return {
      content: [
        {
          type: "text",
          text: `Failed to update user: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
    };
  }
}

export async function handleDeleteUser(
  params: z.infer<typeof DeleteUserToolSchema>
) {
  try {
    logger.info("Deleting user via MCP tool", { params });

    const success = await userService.deleteUser(params.id);

    if (!success) {
      return {
        content: [
          {
            type: "text",
            text: `User with ID ${params.id} not found`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `User with ID ${params.id} deleted successfully`,
        },
      ],
    };
  } catch (error) {
    logger.error("Failed to delete user via MCP tool", {
      params,
      error: error instanceof Error ? error.message : error,
    });

    return {
      content: [
        {
          type: "text",
          text: `Failed to delete user: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
    };
  }
}

export async function handleGetUser(params: z.infer<typeof GetUserToolSchema>) {
  try {
    logger.info("Getting user via MCP tool", { params });

    const user = await userService.getUserById(params.id);

    if (!user) {
      return {
        content: [
          {
            type: "text",
            text: `User with ID ${params.id} not found`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `User found: ${JSON.stringify(user, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    logger.error("Failed to get user via MCP tool", {
      params,
      error: error instanceof Error ? error.message : error,
    });

    return {
      content: [
        {
          type: "text",
          text: `Failed to get user: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
    };
  }
}
