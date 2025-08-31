# MCP Projects Monorepo

This repository contains multiple projects related to the [Model Context Protocol (MCP)](https://modelcontextprotocol.org/), including a Go-based MCP server and a TypeScript-based user management MCP server.

## Projects

### 1. [mcp-go](mcp-go/)

A Go implementation of an MCP server with example tools, prompts, and resources.

- **Language:** Go
- **Entry Point:** [`main.go`](mcp-go/main.go)
- **Usage:**
  ```sh
  cd mcp-go
  go run main.go
  ```

### 2. [mcp-user-management](mcp-user-management/)

A TypeScript MCP server for user management, featuring CRUD operations, validation, and structured logging.

- **Language:** TypeScript (Node.js)
- **Entry Point:** [`src/server.ts`](mcp-user-management/src/server.ts)
- **Usage:**
  ```sh
  cd mcp-user-management
  npm install
  npm run build
  npm start
  ```

## Features

1. Modular MCP server implementations in Go and TypeScript
2. User management with validation and logging (mcp-user-management)
3. Example tools, prompts, and resources (mcp-go)
4. Ready for use with MCP Inspector and VS Code integration
