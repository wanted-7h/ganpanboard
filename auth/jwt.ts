import { sign } from "$hono/middleware/jwt/index.ts"

const seconds = 1000
const minutes = 60 * seconds
const hours = 60 * minutes
const expireAge = 1 * hours

import env from "../.env.json" with { type: "json" }
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
