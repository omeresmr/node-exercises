const http = require('http');
const messages = [];

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  // / Route
  if (url === '/') {
    res.setHeader('Content', 'text/html');
    res.write(
      '<html><body><form action="/add-message" method="POST"><input type="text" placeholder="Message" name="message"/><button>Submit</button></form></body></html>'
    );
    // Stop response
    return res.end();
  }

  // /add-message Route
  if (url === '/add-message' && method === 'POST') {
    const body = [];
    // Push chunks into body
    req.on('data', (chunk) => body.push(chunk));
    req.on('end', () => {
      // Parse the "melted" Buffers into a string
      const parsedBody = Buffer.concat(body).toString();

      // Get the entered message
      const message = parsedBody.split('=')[1];

      // Save the message or show an error
      message.trim().length === 0
        ? console.error('ERROR! Empty message entered!')
        : messages.push(message);

      // Redirect user to /
      res.setHeader('Location', '/');
      res.statusCode = 302;

      // Stop response
      return res.end();
    });
  }
});

server.listen(3000);
