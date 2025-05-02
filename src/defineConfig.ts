import path from 'node:path'
import fs from 'node:fs'

export interface Config {
  containerName: string
  username: string
  password: string
  database: string
}

let config: Config | null = null

export function loadConfigFromFile(filePath: string): Config {
  const absolutePath = path.resolve(filePath)
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Config file not found at ${absolutePath}`)
  }
  const fileContent = fs.readFileSync(absolutePath, 'utf-8')
  const parsed = JSON.parse(fileContent)
  defineConfig(parsed)
  return config!
}

export default function defineConfig({
  containerName,
  username,
  password,
  database,
}: Config): void {
  config = {
    containerName,
    username,
    password,
    database,
  }
}
