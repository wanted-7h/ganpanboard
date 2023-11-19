import { initContract } from "$ts-rest/core"
import { Hono } from "$hono/mod.ts"
import { generateOpenApi } from "$ts-rest/open-api"
import { authContract, columnsContract, teamContract, ticketContract } from "./main.ts"
import { swaggerUI } from "https://esm.sh/@hono/swagger-ui@0.1.0"

const c = initContract()
const apiContract = c.router({
	auth: authContract,
	team: teamContract,
	column: columnsContract,
	ticket: ticketContract,
})

const doc = generateOpenApi(apiContract, {
	info: {
		title: "GanpanBoard API",
		version: "0.0.1",
		license: {
			name: "agpl-3.0-only",
			url: "https://spdx.org/licenses/AGPL-3.0-only.html",
		},
	},
})

if (import.meta.main) {
	const app = new Hono()
		.get("/openapi.json", (c) => c.json(doc))
		.get("/openapi", swaggerUI({ url: "/openapi.json" }))

	Deno.serve(app.fetch)
}
