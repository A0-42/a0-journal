import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = createServer(async (req, res) => {
	const url = new URL(req.url, `http://${req.headers.host}`);
	const filePath = join(__dirname, 'static', url.pathname === '/' ? 'index.html' : url.pathname.slice(1));

	// Load the file and serve it
	try {
		const fs = await import('fs/promises');
		const content = await fs.readFile(filePath, 'utf-8');

		// Set content type based on extension
		const ext = url.pathname.split('.').pop();
		const contentTypes = {
			html: 'text/html',
			css: 'text/css',
			js: 'application/javascript'
		};

		res.setHeader('Content-Type', contentTypes[ext] || 'text/plain');
		res.writeHead(200);
		res.end(content);
	} catch (err) {
		if (err.code === 'ENOENT') {
			res.writeHead(404);
			res.end('Not found');
		} else {
			res.writeHead(500);
			res.end('Server error');
		}
	}
});

const PORT = process.env.PORT || 4173;

server.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}/`);
});
