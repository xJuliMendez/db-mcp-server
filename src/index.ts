import { exec } from 'node:child_process'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { getConfig } from './defineConfig.js'

const MCP_CONSTANTS = {
  TEXT: 'text',
} as const

const config = {
  name: 'mcp-server-mysql',
  version: '1.0.0',
  containerName: 'db-mcp-server-mysql-1',
  username: 'root',
  password: 'root',
  database: 'mydb',
}

const server = new McpServer({
  name: config.name,
  version: config.version,
})

async function execQuery(query: string): Promise<string> {
  const command = `docker exec ${config.containerName} mysql -u ${config.username} -p${config.password} ${config.database} -e "${query}"`

  return new Promise((resolve, reject) => {
    let text = ''

    const commandResult = exec(command)

    commandResult.stdout?.on('data', data => {
      text += data
    })

    commandResult.on('close', code => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`))
      } else {
        resolve(text)
      }
    })

    commandResult.on('error', err => {
      reject(err)
    })
  })
}

async function getInfoFromDockerByQuery(query: string) {
  const queryResult = await execQuery(query)

  return {
    content: [
      {
        type: MCP_CONSTANTS.TEXT,
        text: queryResult.replaceAll('\n', '||'),
      },
    ],
  }
}

server.tool('get', { query: z.string() }, async ({ query }) => getInfoFromDockerByQuery(query))

const transport = new StdioServerTransport()
await server.connect(transport)
