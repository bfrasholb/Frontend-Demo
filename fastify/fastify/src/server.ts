import { apiRoutes } from "./api.js";
import Fastify from "fastify";
import { Type, TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import cors from "@fastify/cors";

const app = Fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();

app.addHook("onRequest", async (request) => {
	console.log("onRequest:", request.method, request.url);
});

app.addHook("onSend", async (request, reply, payload) => {
	reply.header("x-course", "fastify-basics");
	return payload;
});

await app.register(cors, { origin: "http://localhost:5173" });

app.get("/", async () => {
	return { hello: "world" };
});

app.get(
	"/users/:id",
	{
		schema: {
			params: Type.Object({ id: Type.Integer() }),
			response: {
				200: Type.Object({ id: Type.Integer(), name: Type.String() }),
			},
		},
		preHandler: async () => {
			console.log("preHandler ran");
		},
	},
	async (request) => {
		const { id } = request.params;
		return { id, name: "Ada", password: "secret" };
	},
);

app.post(
	"/users",
	{
		schema: {
			body: Type.Object({ name: Type.String({ minLength: 1 }) }),
		},
	},
	async (request, reply) => {
		const body = request.body;
		reply.status(201);
		return { created: body.name };
	},
);

app.get("/items", async (request) => {
	const { limit } = request.query as { limit?: string };
	const num = Number(limit);
	const usable =
		limit !== undefined && limit.trim() !== "" && !Number.isNaN(num);
	return {
		limit,
		kind: typeof limit,
		usable,
		doubled: usable ? num * 2 : null,
	};
});

app.put("/users/:id", async (request) => {
	const { id } = request.params as { id: string };
	const body = request.body as { name: string };
	return { id, updatedName: body.name };
});

app.delete("/users/:id", async (request, reply) => {
	const { id } = request.params as { id: string };
	if (id === "0") {
		reply.status(404);
		return { error: "no such user" };
	}
	reply.status(204);
	return;
});

// style 1: async handler, RETURN the value
app.get("/a", async () => {
	return { style: "return" };
});

// style 2: normal (not async) handler, CALL reply.send
app.get("/b", (request, reply) => {
	reply.send({ style: "send" });
});

// the trap: async handler that does neither
app.get("/c", async () => {
	console.log("handler ran, but I return nothing");
});

await app.register(apiRoutes, { prefix: "/api" });
await app.listen({ port: 3000, host: "0.0.0.0" });
