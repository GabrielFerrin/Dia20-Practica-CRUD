export const cors = (req, res, next) => {
  const origin = req.headers.origin || req.headers.host
  const allowedOrigins = new Set([
    'http://127.0.0.1:5500',
    'http://localhost:3001',
    'https://funval-users-fe.onrender.com/'
  ])
  const isAllowed = allowedOrigins.has(origin)
  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : '')
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next()
}

export const corsOptions = (req, res) => {
  const origin = req.headers.origin || req.headers.host
  const allowedOrigins = new Set([
    'http://127.0.0.1:5500',
    'https://funval-users-fe.onrender.com'
  ])
  const isAllowed = allowedOrigins.has(origin)
  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : '')
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.status(204).end()
}
