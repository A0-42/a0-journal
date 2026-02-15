import { readFileSync } from 'fs';
import { env } from '$env/dynamic/private';

const GITHUB_API_BASE = 'https://api.github.com/repos/A0-42/a0-content/contents/posts';

// Load GITHUB_TOKEN from .env file directly for SSG build
function loadToken() {
try {
const envContent = readFileSync('.env', 'utf-8');
const tokenMatch = envContent.match(/^GITHUB_TOKEN=(.+)$/m);
if (tokenMatch) {
return tokenMatch[1].trim();
}
} catch {
// Fallback to env.GITHUB_TOKEN
}
return env.GITHUB_TOKEN;
}

const GITHUB_TOKEN = loadToken();

export interface GitHubFile {
name: string;
path: string;
sha: string;
size: number;
url: string;
html_url: string;
git_url: string;
download_url: string;
type: string;
_links: {
self: string;
git: string;
html: string;
};
}

export async function fetchAllPosts(): Promise<GitHubFile[]> {
if (!GITHUB_TOKEN) {
throw new Error('GITHUB_TOKEN not found in environment variables');
}

const response = await fetch(GITHUB_API_BASE, {
headers: {
'Authorization': `token ${GITHUB_TOKEN}`,
'Accept': 'application/vnd.github.v3+json'
}
});

if (!response.ok) {
throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
}

const files = (await response.json()) as GitHubFile[];

// Filter only .md files
return files.filter(file => file.name.endsWith('.md'));
}

export async function fetchPostContent(downloadUrl: string): Promise<string> {
if (!GITHUB_TOKEN) {
throw new Error('GITHUB_TOKEN not found in environment variables');
}

const response = await fetch(downloadUrl, {
headers: {
'Authorization': `token ${GITHUB_TOKEN}`,
'Accept': 'application/vnd.github.v3.raw'
}
});

if (!response.ok) {
throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
}

return await response.text();
}
