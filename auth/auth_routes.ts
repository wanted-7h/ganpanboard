import { initServer } from "$ts-rest-hono/mod.ts"
import { authContract } from "./auth_contract.ts"
import { authenticate } from "./jwt.ts"

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
