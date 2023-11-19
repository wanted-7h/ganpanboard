import {} from "$ts-rest/open-api"
import { initContract } from "$ts-rest/core"
import { z } from "$zod/mod.ts"

const c = initContract()

export const userSchema = z.object({
	jwt: z.string(),
})

export const authContract = c.router({
	signUp: {
		method: "POST",
		path: "/signup",
		body: z.object({
			username: z.string(),
			password: z.string(),
		}),
		responses: { 201: null },
	},
	signIn: {
		method: "POST",
		path: "/signin",
		body: z.object({
			username: z.string(),
			password: z.string(),
		}),
		responses: { 200: userSchema },
	},
})

const baseHeaders = {
	baseHeaders: z.object({ Authorization: z.string() }),
}
export const teamContract = c.router({
	create: {
		method: "POST",
		path: "/",
		body: z.object({
			name: z.string(),
		}),
		responses: { 201: null },
	},
	invite: {
		method: "POST",
		path: "/invite",
		body: z.object({
			name: z.string(),
		}),
		responses: { 201: null },
	},
	join: {
		method: "POST",
		path: "/join",
		body: z.object({
			name: z.string(),
		}),
		responses: { 201: null },
	},
}, baseHeaders)

export const naturalSchema = z.number().int().positive()
export const idSchema = z.string().uuid()

const ticketSchema = z.object({
	title: z.string(),
	position: naturalSchema,
	tag: z.enum(["Frontend", "Backend", "Design", "QA", "PM", "Document"]),
	hours: z.number().positive(),
	until: z.date(),
	assignee: idSchema.optional(),
})

const columnSchema = z.object({
	title: z.string(),
	tickets: z.array(ticketSchema),
	position: naturalSchema,
})

export const ticketContract = c.router({
	add: {
		method: "POST",
		path: "/",
		body: ticketSchema.omit({ position: true }),
		responses: { 201: ticketSchema },
	},
	reorder: {
		method: "PUT",
		path: "/{column}",
		query: z.object({ to: naturalSchema }),
		body: null,
		responses: { 200: null },
	},
	remove: {
		method: "DELETE",
		path: "/{column}",
		body: null,
		responses: { 200: null },
	},
	edit: {
		method: "PATCH",
		path: "/{column}",
		body: ticketSchema.omit({ position: true }),
		responses: { 200: null },
	},
}, {
	...baseHeaders,
	pathPrefix: "/{board}/{column}",
})

export const columnsContract = c.router({
	getAll: {
		method: "GET",
		path: "/",
		responses: {
			200: z.array(columnSchema),
		},
	},
	add: {
		method: "POST",
		path: "/",
		body: columnSchema,
		responses: { 201: null },
	},
	remove: {
		method: "DELETE",
		path: "/{column}",
		body: null,
		responses: { 200: null },
	},
	reorder: {
		method: "PUT",
		path: "/{column}",
		body: z.object({ to: naturalSchema }),
		responses: { 200: null },
	},
	edit: {
		method: "PATCH",
		path: "/{column}",
		body: columnSchema.omit({ position: true }),
		responses: { 200: null },
	},
}, {
	...baseHeaders,
	pathPrefix: "/{board}",
})
