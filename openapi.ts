import { Hono } from "$hono/mod.ts"
import { swaggerUI } from "$hono-swagger-ui"
import { OpenAPIObject } from "$openapi3-ts/index.d.ts"
import { initContract } from "$ts-rest/core"

import { columnsContract, statsContarct, teamContract, ticketContract } from "./contract.ts"
import { authContract } from "./auth/mod.ts"
import { generateOpenApiWithAuth } from "./openapi_auth.ts"

const c = initContract()
const apiContract = c.router({
	auth: authContract,
	team: teamContract,
	column: columnsContract,
	ticket: ticketContract,
	stats: statsContarct,
})

export const doc = generateOpenApiWithAuth(apiContract, {
	info: {
		title: "GanpanBoard API",
		version: "0.0.1",
		license: {
			name: "agpl-3.0-only",
			url: "https://spdx.org/licenses/AGPL-3.0-only.html",
		},
	},
	components: {
		securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } },
	},
})

const manuallySwaggerUIHtml = (asset: { css: string[]; js: string[] }) => /*html*/ `
    <div>
        <div id="swagger-ui"></div>
        ${asset.css.map((url) => /*html*/ `<link rel="stylesheet" href="${url}" />`)}
        ${asset.js.map((url) => /*html*/ `<script src="${url}" crossorigin="anonymous"></script>`)}
        <script>
            window.onload = () => {
                window.ui = SwaggerUIBundle({
                    dom_id: '#swagger-ui',
                    url: '/openapi.json',
                    persistAuthorization: true,
                })
            }
        </script>
    </div>
    `

export const apiRouter = (doc: OpenAPIObject) =>
	new Hono()
		.get("/openapi.json", (c) => c.json(doc))
		.get("/openapi", swaggerUI({ url: "/openapi.json", manuallySwaggerUIHtml }))

if (import.meta.main) {
	Deno.serve(apiRouter(doc).fetch)
}
