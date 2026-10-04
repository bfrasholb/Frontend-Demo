import type { FastifyPluginAsync } from "fastify";

export const apiRoutes: FastifyPluginAsync = async (app) => {
	app.addHook("onRequest", async () => {
		console.log("api-only hook");
	});

	app.get("/ping", async () => {
		return { pong: true };
	});
};
