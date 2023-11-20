import {} from "$ts-rest/open-api"
import { createHonoEndpoints, initServer } from "$ts-rest-hono/mod.ts"
import { sign } from "$hono/middleware/jwt/index.ts"

const seconds = 1000
const minutes = 60 * seconds
const hours = 60 * minutes
const expireAge = 1 * hours

import env from "./.env.json" with { type: "json" }
import { Hono } from "$hono/mod.ts"
import { apiRouter, doc } from "./openapi.ts"
import { authContract } from "./authSchema.ts"

export type JwtPayload = {
	iat: number
	sub: string
	exp: number
	userId: number
	name: string
}

export const authenticate = async (user: {
	name: string
	password: string
	id: number
}) => {
	const payload: JwtPayload = {
		iat: Date.now() / 1000, // 1000 으로 나눠서 초 단위로 만들어줌
		sub: "wanted social-feed user",
		exp: Date.now() / 1000 + expireAge,
		userId: user.id,
		name: user.name,
	}
	const jwt = await sign(payload, env.secret)
	return jwt
}

const s = initServer()
export const authRouter = s.router(authContract, {
	signUp: async ({ body }) => {
		// if user exists, return error

		// create new user
		const user = { id: 1, ...body }

		// return JWT

		const jwt = await authenticate(user)
		return { status: 201, body: { jwt } }
	},
	signIn: async ({ body }) => {
		// find user from DB
		const user = { id: 1, ...body }

		const jwt = await authenticate(user)
		return { status: 200, body: { jwt } }
	},
})

const app = new Hono()

app.route("", apiRouter(doc))

createHonoEndpoints(authContract, authRouter, app)

Deno.serve(app.fetch)
