import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'

const app = new Hono()

// serve static frontend files (requires /dist to be populated)
app.get('/', serveStatic({ path: './dist/frontend/index.html' }))
app.use('/*', serveStatic({ root: './dist/frontend' }))

// TEMP - until I add Postgres
const TEMP_MESSAGES = [
  {
    message: 'Message 1',
    timestamp: '1'
  },
  {
    message: 'Message 2',
    timestamp: '2'
  }
]

// GET all messages (limit to 5 eventually)
app.get('/api/messages', (c) => {
    return c.json({
      messages: TEMP_MESSAGES
    })
})

// POST a message
app.post('/api/message', async (c) => {
  const { message } = await c.req.json();
  TEMP_MESSAGES.push({message, timestamp: '3'})
  return c.json({ status: 'success' });
});

// App setup
const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
