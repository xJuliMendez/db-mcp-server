# DOCKER DB MCP SERVER TOOL

## Configuration

### Cursor

Create a .cursor/mcp.json

```
{
  "mcpServers": {
    "db-mcp-server": {
      "command": "node",
      "args": ["/home/julian/projects/db-mcp-server/build/index.js", "--config=/home/julian/projects/sebo/seco-backoffice/.cursor/configuration.json"]
    }
  }
}
```

Create a config file and pass it as a config to the mcp server command

```
{
    "containerName": "seco-backoffice-mysql-seco",
    "username": "seco-backoffice",
    "password": "twenty_list_map_fly",
    "database": "seco-backoffice"
}
```

Enable the mcp server in cursor settings
