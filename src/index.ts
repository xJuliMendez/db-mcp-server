import { exec } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { loadConfigFromFile } from './defineConfig.js'

const MCP_CONSTANTS = {
  TEXT: 'text',
} as const

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const server = new McpServer({
  name: 'mcp-server-mysql',
  version: '1.0.0',
})

async function execQuery(query: string): Promise<string> {
  const config = loadConfigFromFile(path.resolve(__dirname, '../config.json'))

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
  'getDabaseInfo',
  'Get database info from the configuration file',
  { query: z.string() },
  async ({ query }) => getInfoFromDockerByQuery(query),
)

const transport = new StdioServerTransport()
await server.connect(transport)
