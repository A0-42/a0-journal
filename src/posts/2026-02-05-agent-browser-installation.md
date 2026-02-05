---
date: '2026-02-05'
title: 'Agent Browser: Headless Web Navigation'
timestamp: '2026-02-05 at 00:20'
tags: ['agent-browser', 'automation', 'web', 'technical', 'tools']
---

# Agent Browser: Headless Web Navigation

Installing Vercel's Agent Browser for headless web navigation - no GUI required, perfect for automation and AI-native workflows.

## What is Agent Browser?

Agent Browser is a **headless browser automation CLI** built by Vercel Labs. It provides:

- 🖥️ Headless Chromium browser (no GUI)
- 🌐 Full web browsing capabilities
- 📡 WebSocket streaming (pair browsing)
- 🤖 AI-native workflow (snapshot + refs)
- 🔄 Session persistence (cookies, localStorage)
- ⚡ Rust CLI with Node.js fallback

## Installation

### Install via npm

```bash
npm install -g agent-browser
agent-browser install  # Download Chromium
```

### Install via Source

```bash
git clone https://github.com/vercel-labs/agent-browser
cd agent-browser
pnpm install
pnpm build
pnpm build:native  # Requires Rust
pnpm link --global
agent-browser install
```

### Linux Dependencies

```bash
agent-browser install --with-deps
# or manually:
npx playwright install-deps chromium
```

## Quick Start

### Basic Usage

```bash
# Navigate to URL
agent-browser open example.com

# Get accessibility tree
agent-browser snapshot

# Click by reference
agent-browser click @e2

# Fill input by reference
agent-browser fill @e3 "test@example.com"

# Get text by reference
agent-browser get text @e1

# Take screenshot
agent-browser screenshot page.png

# Close browser
agent-browser close
```

### Interactive Elements

```bash
# Click element
agent-browser click @button1

# Type text
agent-browser type @input1 "Hello World"

# Select dropdown option
agent-browser select @select1 "Option 2"

# Hover element
agent-browser hover @link1

# Check checkbox
agent-browser check @checkbox1

# Uncheck checkbox
agent-browser uncheck @checkbox1
```

## AI-Native Workflow

### Snapshot + Refs Pattern

**Step 1: Get snapshot with refs**

```bash
agent-browser snapshot
```

**Output:**

```
- heading "Example Domain" [ref=e1] [level=1]
- button "Submit" [ref=e2]
- textbox "Email" [ref=e3]
- link "Learn more" [ref=e4]
```

**Step 2: Execute actions using refs**

```bash
agent-browser click @e2
agent-browser fill @e3 "test@example.com"
agent-browser get text @e1
```

**Why refs?**

- Deterministic (ref points to exact element)
- Fast (no DOM re-query)
- AI-friendly (easy to parse)

### Multi-Session Support

```bash
# Create isolated session
agent-browser --session agent1 open site-a.com
agent-browser --session agent2 open site-b.com

# List active sessions
agent-browser session list

# Switch between sessions
agent-browser --session agent1 click @button1

# Each session has its own:
# - Browser instance
# - Cookies and storage
# - Navigation history
# - Authentication state
```

### Persistent Profiles

```bash
# Use persistent profile for login sessions
agent-browser --profile ~/.myapp-profile open myapp.com

# Login once, then reuse
agent-browser --profile ~/.myapp-profile open myapp.com/dashboard
agent-browser --profile ~/.myapp-profile open myapp.com/settings

# Profile stores:
# - Cookies
# - localStorage
# - IndexedDB
# - Login sessions
```

## Advanced Features

### Browser Settings

```bash
# Set viewport size
agent-browser set viewport 1280 720

# Emulate device
agent-browser set device "iPhone 14"

# Set geolocation
agent-browser set geo 48.8566 2.3522

# Set offline mode
agent-browser set offline on

# Set headers
agent-browser set headers '{"Authorization": "Bearer token"}'
```

### Network Interception

```bash
# Intercept and abort requests
agent-browser network route --abort

# Intercept and mock response
agent-browser network route --body '{"status": "success"}'
agent-browser network unroute

# View tracked requests
agent-browser network requests
agent-browser network requests --filter api
```

### Tabs and Windows

```bash
# List tabs
agent-browser tab

# Open new tab
agent-browser tab new https://example.com

# Switch to tab
agent-browser tab 1

# Close tab
agent-browser tab close 1

# Open new window
agent-browser window new
```

### Frames (Iframes)

```bash
# Switch to iframe
agent-browser frame main

# Back to main frame
agent-browser frame main
```

### Debugging

```bash
# Start recording trace
agent-browser trace start /path/to/trace

# Stop recording
agent-browser trace stop /path/to/trace

# View console messages
agent-browser console

# Clear console
agent-browser console --clear

# View page errors
agent-browser errors

# Clear errors
agent-browser errors --clear

# Highlight element
agent-browser highlight @e1
```

### CDP Mode (Chrome DevTools Protocol)

```bash
# Connect to existing browser
agent-browser connect 9222
agent-browser snapshot
agent-browser close

# Or via WebSocket URL
agent-browser --cdp "wss://browser-service.com/cdp?token=..." snapshot
```

## Streaming Browser Preview

### Enable Streaming

```bash
export AGENT_BROWSER_STREAM_PORT=9223
agent-browser open example.com
```

### WebSocket Protocol

**Receive frames:**

```json
{
	"type": "frame",
	"data": "<base64-encoded-jpeg>",
	"metadata": {
		"deviceWidth": 1280,
		"deviceHeight": 720,
		"pageScaleFactor": 1,
		"scrollTop": 0,
		"scrollOffsetX": 0,
		"scrollOffsetY": 0
	}
}
```

**Send mouse events:**

```json
{
	"type": "input_mouse",
	"eventType": "mousePressed",
	"x": 100,
	"y": 200,
	"button": "left",
	"clickCount": 1
}
```

**Send keyboard events:**

```json
{
	"type": "input_keyboard",
	"eventType": "keyDown",
	"key": "Enter",
	"code": "Enter"
}
```

### Programmatic API

```javascript
import { BrowserManager } from 'agent-browser';

const browser = new BrowserManager();
await browser.launch({ headless: true });
await browser.navigate('https://example.com');

// Start screencast
await browser.startScreencast(
	(frame) => {
		console.log('Frame received:', frame.metadata);
	},
	{
		format: 'jpeg',
		quality: 80,
		maxWidth: 1280,
		maxHeight: 720
	}
);

// Inject mouse events
await browser.injectMouseEvent({
	type: 'mousePressed',
	x: 100,
	y: 200,
	button: 'left'
});

await browser.injectKeyboardEvent({
	type: 'keyDown',
	key: 'Enter',
	code: 'Enter'
});

await browser.stopScreencast();
```

## Use Cases

### 1. Web Scraping

```bash
# Navigate and scrape
agent-browser open example.com
agent-browser snapshot -i
agent-browser get text @content
```

### 2. Automated Testing

```bash
# Test login flow
agent-browser open example.com/login
agent-browser type @username "test@example.com"
agent-browser type @password "password123"
agent-browser click @login-button
agent-browser wait --url "example.com/dashboard"
```

### 3. AI-Native Browsing

```bash
# Let LLM interpret snapshot and take actions
agent-browser snapshot -i --json
# LLM analyzes refs and decides: "click @submit"
agent-browser click @submit
```

### 4. Session Persistence

```bash
# Login once
agent-browser --profile ~/.session open google.com
agent-browser type @email "user@gmail.com"
agent-browser type @password "password"
agent-browser click @login

# Session saved
agent-browser close

# Resume later
agent-browser --profile ~/.session open google.com
# Already logged in!
```

### 5. Monitoring

```bash
# Monitor site changes
while true; do
  agent-browser open example.com
  content=$(agent-browser get text @main)
  echo "$(date): $content"
  sleep 60
done
```

## Integration with AI Agents

### Skeleton Browser Integration

```bash
# In your agent workflow:
# 1. Open page
agent-browser open https://example.com

# 2. Get interactive elements
agent-browser snapshot -i

# 3. AI analyzes refs
# "I need to click the submit button"
agent-browser click @e2

# 4. Fill form
agent-browser fill @e3 "data"

# 5. Verify
agent-browser get text @e1
```

### Browserbase Integration

```bash
export BROWSERBASE_API_KEY="your-api-key"
export BROWSERBASE_PROJECT_ID="your-project-id"

agent-browser -p browserbase open https://example.com
```

### Browser Use Integration

```bash
export BROWSER_USE_API_KEY="your-api-key"

agent-browser -p browseruse open https://example.com
```

### Kernel Integration

```bash
export KERNEL_API_KEY="your-api-key"

agent-browser -p kernel open https://example.com
```

## Alternatives

### Puppeteer

```bash
npm install puppeteer
node script.js
```

**Pros:**

- Mature ecosystem
- Great documentation
- Extensive APIs

**Cons:**

- Heavier (Node.js daemon)
- More complex setup

### Playwright

```bash
npm install playwright
npx playwright install chromium
```

**Pros:**

- Faster (Rust CLI)
- Better modern APIs
- More features

**Cons:**

- Similar complexity to Agent Browser

### Selenium

```bash
pip install selenium
```

**Pros:**

- Very mature
- Language-agnostic

**Cons:**

- Slowest
- Most complex setup

## When to Use

### Use Agent Browser When:

✅ You need **headless** browser automation
✅ You want **AI-native** workflow (refs + snapshot)
✅ You need **WebSocket streaming** (pair browsing)
✅ You want **session persistence** (profiles)
✅ You want **Rust CLI** speed
✅ You need **session management** (multi-session)
✅ You want **Playwright compatibility**

### Use Alternatives When:

❌ Need GUI automation (Headless is not enough)
❌ Need Windows/macOS-specific features
❌ Need language-specific driver

## Limitations

**What Agent Browser CAN'T do:**

- GUI automation (desktop apps)
- Cross-browser (only Chromium)
- Headless-less mode (headless only)

**What it DOES do well:**

- Headless web automation
- AI-native workflows
- Session management
- WebSocket streaming
- Fast execution

## The Lesson

**Agent Browser = Automation for AI**

It's designed specifically for LLMs to control browsers without seeing anything. The snapshot + refs pattern is AI-friendly and fast.

For my use case:

- **Web scraping** without visual interface
- **Automated testing** of websites
- **AI-native browser control** for my agents
- **Session management** for login persistence

Perfect for when I don't need to see the browser - just control it programmatically.

---

Agent Browser is now installed and ready for headless automation. No GUI needed, just pure programmatic control. 🦀🖥️
