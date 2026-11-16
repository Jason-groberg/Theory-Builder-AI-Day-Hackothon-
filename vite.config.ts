import react from '@vitejs/plugin-react'
import { existsSync } from 'node:fs'
import { Readable } from 'node:stream'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/**
 * Serves netlify/functions/<name>.ts at /api/<name> during `npm run dev`, so
 * the tutor works locally without the Netlify CLI. The functions use the
 * web-standard Request/Response signature, so this is a thin adapter.
 */
function netlifyFunctionsDev(): Plugin {
  return {
    name: 'netlify-functions-dev',
    apply: 'serve',
    configureServer(server) {
      Object.assign(process.env, loadEnv('development', process.cwd(), ''))

      server.middlewares.use('/api', async (req, res) => {
        const name = (req.url ?? '').split('?')[0].replace(/^\/+|\/+$/g, '')
        const file = `/netlify/functions/${name}.ts`
        if (!/^[\w-]+$/.test(name) || !existsSync(`${process.cwd()}${file}`)) {
          res.statusCode = 404
          res.end('Not found')
          return
        }
        try {
          const handler = (await server.ssrLoadModule(file)).default as (
            req: Request,
            context: { ip?: string },
          ) => Promise<Response>

          const hasBody = req.method !== 'GET' && req.method !== 'HEAD'
          const init: RequestInit & { duplex?: 'half' } = {
            method: req.method,
            headers: req.headers as Record<string, string>,
          }
          if (hasBody) {
            init.body = Readable.toWeb(req) as ReadableStream
            init.duplex = 'half' // required by Node when the body is a stream
          }
          const request = new Request(`http://${req.headers.host}/api/${name}`, init)
          const response = await handler(request, { ip: req.socket.remoteAddress })

          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          if (response.body) Readable.fromWeb(response.body as never).pipe(res)
          else res.end()
        } catch (err) {
          server.ssrFixStacktrace(err as Error)
          console.error(err)
          res.statusCode = 500
          res.end('Function error')
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), netlifyFunctionsDev()],
})
