import { initContract } from "$ts-rest/core"
import { z } from "$zod/mod.ts"

const c = initContract()

export const baseHeaders = {
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
}, {
	...baseHeaders,
	pathPrefix: "/team",
})

export const positiveSchema = z.number().positive()
export const naturalSchema = positiveSchema.int()
export const idSchema = z.string().uuid()
export const tagSchema = z.enum(["Frontend", "Backend", "Design", "QA", "PM", "Document"])
const ticketSchema = z.object({
	title: z.string(),
	position: naturalSchema,
	tag: tagSchema,
	hours: positiveSchema,
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

export const columnsSchema = z.string()
	.regex(/^\d+(,\d+)*$/, `"1" 또는 "1,2,3" 형태로 입력해주세요.`)
	.transform((v) => v.split(",").map(Number))

export const statQuerySchema = z.object({
	columns: columnsSchema,
	begin: z.date(),
	end: z.date(),
}).partial()

export const statEntrySchema = z.object({
	id: idSchema,
	name: z.string(),
	totalHours: positiveSchema.describe("작업시간 합"),
	contribution: z.number().describe("기여도"),
})

export const statsContarct = c.router({
	oneMember: {
		method: "GET",
		path: "/{user}",
		query: statQuerySchema,
		responses: {
			200: z.array(statEntrySchema),
		},
	},
	allMembers: {
		method: "GET",
		path: "/",
		query: statQuerySchema.extend({
			tag: tagSchema,
		}),
		responses: {
			200: z.array(statEntrySchema),
		},
	},
}, {
	...baseHeaders,
	pathPrefix: "/{board}/stats",
})
