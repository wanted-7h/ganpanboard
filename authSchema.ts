import { z } from "$zod/mod.ts"
import { initContract } from "$ts-rest/core"

const c = initContract()

export const authSchema = z.object({
	jwt: z.string(),
})

export const authContract = c.router({
	signUp: {
		method: "POST",
		path: "/signup",
		body: z.object({
			name: z.string(),
			password: z.string(),
		}),
		responses: { 201: authSchema },
	},
	signIn: {
		method: "POST",
		path: "/signin",
		body: z.object({
			name: z.string(),
			password: z.string(),
		}),
		responses: { 200: authSchema },
	},
})
