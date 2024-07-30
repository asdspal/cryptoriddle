const { getFrameHtmlResponse } = require('frames.js');
const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/api/frame') {
    const frameHtml = getFrameHtmlResponse({
      buttons: [
        {
          label: 'Test Button',
        },
      ],
      image: 'https://picsum.photos/seed/frames.js/1146/600',
      postUrl: `http://localhost:${PORT}/api/frame`,
    });

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(frameHtml);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Debug server running at http://localhost:${PORT}`);
  console.log(`Frame URL: http://localhost:${PORT}/api/frame`);
});
