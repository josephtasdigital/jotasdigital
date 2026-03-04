export default async function handler(req, res) {
  try {
    const { code } = req.query;
    
    // Attempting the Token Exchange
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });
    
    const data = await response.json();
    
    // ARCHITECTURE CHECK: Did GitHub reject our keys?
    if (data.error) {
      return res.status(200).send(`<h2>Authentication Failed</h2><p>GitHub says: ${data.error_description || data.error}</p><p>Check your Vercel Environment Variables!</p>`);
    }

    const token = data.access_token;

    // The Decap CMS Handshake Script
    const script = `
      <!DOCTYPE html>
      <html>
      <body>
        <script>
          (function() {
            function receiveMessage(e) {
              window.opener.postMessage(
                'authorization:github:success:{"token":"${token}", "provider":"github"}',
                e.origin
              );
            }
            window.addEventListener("message", receiveMessage, false);
            window.opener.postMessage("authorizing:github", "*");
          })();
        </script>
      </body>
      </html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(script);
    
  } catch (error) {
    // If the server itself crashes
    res.status(500).send(`<h2>Server Error</h2><p>${error.message}</p>`);
  }
}
