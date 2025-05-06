import { exec } from 'node:child_process'
import process from 'node:process'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { loadConfigFromFile } from './defineConfig.js'
import { getConfigPathFromCommandLineArguments } from './commandArgument.js'

const MCP_CONSTANTS = {
  TEXT: 'text',
} as const

const server = new McpServer({
  name: 'mcp-server-mysql',
  version: '1.0.0',
})

const configPath = getConfigPathFromCommandLineArguments(process)

async function execQuery(query: string): Promise<string> {
  const config = loadConfigFromFile(configPath)

  const command = `docker exec ${config.containerName} mysql -u ${config.username} -p${config.password} ${config.database} -e "${query}"`

  return new Promise((resolve, reject) => {
    let output = ''

    const commandResult = exec(command)

    commandResult.stdout?.on('data', data => {
      output += data
    })

    commandResult.on('close', code => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`))
      } else {
        resolve(output)
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

server.tool(
  'getDatabaseInfo',
  'Provide a query to get information from the database',
  { query: z.string() },
  async ({ query }) => getInfoFromDockerByQuery(query),
)

const transport = new StdioServerTransport()
await server.connect(transport)
