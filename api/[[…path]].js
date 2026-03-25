export default async function handler(req, res) {
  const { path } = req.query;
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Route handling
  const route = path?.[0] || '';
  
  switch(route) {
    case 'login':
      return handleLogin(req, res);
    case 'batches':
      return handleBatches(req, res);
    case 'topics':
      return handleTopics(req, res);
    case 'content':
      return handleContent(req, res);
    default:
      return res.json({ 
        success: true, 
        message: "✅ RWA API is Running",
        endpoints: ["/api/login", "/api/batches", "/api/topics", "/api/content"]
      });
  }
}

async function handleLogin(req, res) {
  // Login logic yahan
  res.json({ endpoint: "login", working: true });
}

async function handleBatches(req, res) {
  res.json({ endpoint: "batches", working: true });
}

async function handleTopics(req, res) {
  res.json({ endpoint: "topics", working: true });
}

async function handleContent(req, res) {
  res.json({ endpoint: "content", working: true });
}
