export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>RWA API</title>
      <style>
        body { font-family: system-ui, sans-serif; background: #0a0a0a; color: #fff; padding: 40px; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; background: #1a1a1a; padding: 30px; border-radius: 12px; }
        h1 { color: #ff6b6b; margin-bottom: 10px; }
        .status { color: #51cf66; font-size: 18px; margin-bottom: 30px; }
        .endpoint { background: #2a2a2a; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #339af0; }
        code { background: #333; padding: 2px 8px; border-radius: 4px; font-family: monospace; color: #ffa94d; }
        .method { color: #339af0; font-weight: bold; }
        small { color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>✅ RWA API is Running</h1>
        <div class="status">🟢 Status: ONLINE</div>
        
        <h3>📡 Available Endpoints:</h3>
        
        <div class="endpoint">
          <span class="method">GET</span> <code>/api/login?credentials=MOBILE*PASS&api=URL</code>
          <br><small>Login with mobile/password</small>
        </div>
        
        <div class="endpoint">
          <span class="method">GET</span> <code>/api/batches?token=JWT</code>
          <br><small>Get user's batches</small>
        </div>
        
        <div class="endpoint">
          <span class="method">GET</span> <code>/api/topics?token=JWT&batch_id=ID</code>
          <br><small>Get subjects for batch</small>
        </div>
        
        <div class="endpoint">
          <span class="method">GET</span> <code>/api/topics?token=JWT&batch_id=ID&subject_id=ID</code>
          <br><small>Get topics for subject</small>
        </div>
        
        <div class="endpoint">
          <span class="method">GET</span> <code>/api/content?token=JWT&batch_id=ID&subject_id=ID&topic_id=ID</code>
          <br><small>Get content (videos/PDFs)</small>
        </div>
        
        <div class="endpoint">
          <span class="method">GET</span> <code>/api/admin/auth?username=XXX&password=XXX</code>
          <br><small>Admin login</small>
        </div>
        
        <div class="endpoint">
          <span class="method">GET</span> <code>/api/admin/users?username=XXX&password=XXX</code>
          <br><small>Get all users (admin)</small>
        </div>
        
        <div class="endpoint">
          <span class="method">GET</span> <code>/api/admin/batches?username=XXX&password=XXX</code>
          <br><small>Get all batches (admin)</small>
        </div>
        
        <hr style="border-color: #333; margin: 30px 0;">
        <p><small>💡 Frontend is disabled. Use Postman or create your own frontend.</small></p>
        <p><small>🔧 Built with Node.js + MongoDB + Vercel Serverless</small></p>
      </div>
    </body>
    </html>
  `);
}
