import path from 'node:path';
import fs from 'node:fs';
let config = null;
export function loadConfigFromFile(filePath) {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
        throw new Error(`Config file not found at ${absolutePath}`);
    }
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    const parsed = JSON.parse(fileContent);
    defineConfig(parsed);
    return config;
}
export default function defineConfig({ containerName, username, password, database, }) {
    config = {
        containerName,
        username,
        password,
        database,
    };
}
