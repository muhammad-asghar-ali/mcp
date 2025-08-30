import { z } from "zod";
import { logger } from "../utils/logger.js";

export const GenerateFakeUserPromptSchema = z.object({
  name: z.string().min(1, "Name is required").describe("Name of the user"),
});

export const GenerateUserReportPromptSchema = z.object({
  userId: z
    .number()
    .int()
    .positive("User ID must be a positive integer")
    .describe("ID of the user to generate report for"),
});

export const GenerateUserListPromptSchema = z.object({
  format: z
    .enum(["table", "list", "json"])
    .default("table")
    .describe("Format for the user list"),
  limit: z
    .number()
    .int()
    .positive()
    .max(100)
    .describe("Maximum number of users to include"),
});

export async function handleGenerateFakeUser(
  params: z.infer<typeof GenerateFakeUserPromptSchema>
) {
  try {
    logger.info("Generating fake user prompt", { params });

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Generate a fake user with the name "${params.name}" and return the details in JSON format with the following structure:
            {
              "name": "string",
              "email": "string (valid email format)",
              "address": "string (realistic address)",
              "phone": "string (phone number)"
            }

            Make sure the data is realistic and properly formatted.`,
          },
        },
      ],
    };
  } catch (error) {
    logger.error("Failed to generate fake user prompt", {
      params,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}

export async function handleGenerateUserReport(
  params: z.infer<typeof GenerateUserReportPromptSchema>
) {
  try {
    logger.info("Generating user report prompt", { params });

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Generate a detailed report for user with ID ${params.userId}. The report should include:
              1. User profile summary
              2. Account status
              3. Recent activity (if available)
              4. Recommendations or suggestions

              Format the report in a clear, professional manner.`,
          },
        },
      ],
    };
  } catch (error) {
    logger.error("Failed to generate user report prompt", {
      params,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}

export async function handleGenerateUserList(
  params: z.infer<typeof GenerateUserListPromptSchema>
) {
  try {
    logger.info("Generating user list prompt", { params });

    const format = params.format || "table";
    const limit = params.limit ? ` (limit to ${params.limit} users)` : "";

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Generate a user list in ${format} format${limit}. Include the following information for each user:
              - ID
              - Name
              - Email
              - Address
              - Phone

            Make sure the data is well-formatted and easy to read.`,
          },
        },
      ],
    };
  } catch (error) {
    logger.error("Failed to generate user list prompt", {
      params,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}
