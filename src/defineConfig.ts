export interface Config {
  name: string
  version: string
  containerName: string
  username: string
  password: string
  database: string
}

let config: Config | null = {
  containerName: 'db-mcp-server-mysql-1',
  username: 'root',
  password: 'root',
  database: 'mydb',
  name: 'mcp-server-mysql',
  version: '1.0.0',
}

export function getConfig(): Config {
  if (!config) {
    throw new Error('Config is not defined. Use defineConfig to define config first.')
  }
  return config
}

export default function defineConfig({
  name,
  version,
  containerName,
  username,
  password,
  database,
}: Config): void {
  config = {
    name,
    version,
    containerName,
    username,
    password,
    database,
  }
}
