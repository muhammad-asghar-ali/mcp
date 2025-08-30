# MCP User Management Server

A well-organized Model Context Protocol (MCP) server that provides comprehensive user management capabilities with proper error handling, logging, and environment configuration.

## Features

- **User Management**: Create, read, update, and delete users
- **Data Validation**: Comprehensive input validation using Zod schemas
- **Structured Logging**: Configurable logging with different levels and formats
- **Environment Configuration**: Type-safe environment variable handling
- **Error Handling**: Robust error handling with proper error messages
- **Modular Architecture**: Clean separation of concerns with organized modules
- **TypeScript**: Full TypeScript support with strict type checking

## Project Structure

```
src/
├── config/          # Environment configuration
├── mcp/            # MCP-specific modules
│   ├── server.ts   # MCP server setup
│   ├── tools.ts    # MCP tools and handlers
│   ├── resources.ts # MCP resources and handlers
│   └── prompts.ts  # MCP prompts and handlers
├── services/       # Business logic services
│   └── userService.ts
├── utils/          # Utility functions
│   └── logger.ts
└── server.ts       # Main server entry point
```

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Build the server**:

   ```bash
   npm run build
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

## Development

- **Development mode**: `npm run dev`
- **Watch mode**: `npm run build:watch`
- **Linting**: `npm run lint`
- **Formatting**: `npm run format`
- **Testing**: `npm test`

## Environment Configuration

Copy `env.example` to `.env` and configure the following variables:

```bash
# Environment
NODE_ENV=development
PORT=3000

# MCP Server
MCP_SERVER_NAME=mcp-user-management
MCP_SERVER_VERSION=1.0.0

# Database
DATA_FILE_PATH=src/data/users.json

# Logging
LOG_LEVEL=info
LOG_FORMAT=text

# Security
ENABLE_AUTH=false
DANGEROUSLY_OMIT_AUTH=false
```

## Available Tools

### User Management Tools

- `create-user`: Create a new user with name, email, address, and phone
- `update-user`: Update an existing user's information
- `delete-user`: Delete a user from the database
- `get-user`: Retrieve a specific user by ID

### Data Validation

All tools include comprehensive input validation:

- Name: Required string
- Email: Valid email format
- Address: Required string
- Phone: Required string
- ID: Positive integer for user operations

## Available Resources

- `users://all`: Get all users from the database
- `users://{id}/profile`: Get specific user details by ID

## Available Prompts

- `generate-fake-user`: Generate fake user data based on a name
- `generate-user-report`: Generate detailed reports for specific users
- `generate-user-list`: Generate formatted user lists

## VS Code Configuration

The server is configured in `.vscode/mcp.json` to run via stdio transport with development environment settings.

## Troubleshooting

### Common Issues

1. **JSON Parsing Errors**:
   - Ensure the server is properly built (`npm run build`)
   - Check the working directory in VS Code MCP configuration
   - Verify environment variables are set correctly

2. **File Path Issues**:
   - The server uses absolute paths for data file operations
   - Ensure the data file exists at the configured path

3. **TypeScript Compilation Errors**:
   - Run `npm run lint` to check for code issues
   - Ensure all dependencies are installed

### Debugging

1. **Check logs**: The server provides detailed logging with configurable levels
2. **Use MCP Inspector**: `npm run server:inspect`
3. **Development mode**: Use `npm run dev` for real-time development

## Development Guidelines

- **Code Style**: Use ESLint and Prettier for consistent formatting
- **Type Safety**: Leverage TypeScript's strict mode for better code quality
- **Error Handling**: Always use try-catch blocks and proper error logging
- **Logging**: Use the structured logger for consistent log output
- **Validation**: Validate all inputs using Zod schemas
