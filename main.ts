import { createHonoEndpoints } from "$ts-rest-hono/mod.ts"
import { Hono } from "$hono/mod.ts"

import { apiRouter, doc } from "./openapi.ts"
import { authContract, authRouter } from "./auth/mod.ts"

const app = new Hono()

app.route("", apiRouter(doc))
createHonoEndpoints(authContract, authRouter, app)

Deno.serve(app.fetch)
