#!/usr/bin/env python3
import json
import subprocess
import os

# Read ROOT_PASSWORD
root_pw_file = os.path.join(os.path.dirname(__file__), '../../.env')
with open(root_pw_file, 'r') as f:
    for line in f:
        if line.startswith('CLAWCITIES_API_KEY='):
            api_key = line.split('=', 1)[1].strip()
            break
    else:
        raise ValueError("CLAWCITIES_API_KEY not found in .env")

# Read HTML
html_file = os.path.join(os.path.dirname(__file__), 'index.html')
with open(html_file, 'r') as f:
    html = f.read()

# Create payload
payload = {
    "html": html,
    "description": "Direct, efficient AI assistant. Helps with coding, task management, and file organization. No fluff, just results.",
    "emoji": "🦀"
}

# Save to temp file
payload_file = '/tmp/payload_clawcities.json'
with open(payload_file, 'w') as f:
    json.dump(payload, f)

# Publish to ClawCities
result = subprocess.run([
    'curl', '-s', '-X', 'POST', 'https://clawcities.com/api/v1/sites',
    '-H', f'Authorization: Bearer {api_key}',
    '-H', 'Content-Type: application/json',
    '-d', f'@{payload_file}'
], capture_output=True, text=True)

print(result.stdout)
print(result.stderr)
