import { generateOpenApi } from "$ts-rest/open-api"
import { z } from "$zod/mod.ts"
import type { OpenAPIObject, SecuritySchemeObject } from "$openapi3-ts/index.d.ts"

/**
 * Schema to determine whether a parameter is `Authorization` header.
 */
const authSchema = z.object({
	name: z.literal("Authorization"),
	in: z.literal("header"),
	required: z.literal(true),
	schema: z.object({ type: z.literal("string") }),
})
const isAuthed = (xs: unknown[]) => xs.find((x) => authSchema.safeParse(x).success)
type Contract = { parameters: unknown[]; security?: unknown }

/**
 * @private
 *
 * For each contract with `Authorization` header, replace it with security requirement.
 *
 * This is a hacky way to enable authorization modal in Swagger UI.
 *
 * **WARNING: Mutates `doc` in-place**.
 *
 * @param security security object for use in OpenAPI doc.
 */
export const mutateDocAddAuth = (security: Record<string, unknown[]>[]) => (doc: OpenAPIObject) =>
	Object.values(doc.paths)
		.flatMap((router) => Object.values(router) as Contract[])
		.filter((contract) => isAuthed(contract.parameters))
		.forEach((contract) => {
			contract.security = security
			contract.parameters = contract.parameters.filter((x) => !authSchema.safeParse(x).success)
		})

type Param = Parameters<typeof generateOpenApi>
type Components = { components: { securitySchemes: Record<string, SecuritySchemeObject> } }

/**
 * Generate OpenAPI doc with authorization header automatically switched to security requirement.
 */
export const generateOpenApiWithAuth = (
	contract: Param[0],
	apiDoc: Param[1] & Components,
	options?: Param[2],
) => {
	const doc = generateOpenApi(contract, apiDoc, options)
	const security = Object
		.keys(apiDoc.components.securitySchemes)
		.map((x) => ({ [x]: [] }))

	mutateDocAddAuth(security)(doc)

	return doc
}
