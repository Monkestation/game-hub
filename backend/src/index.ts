import { fastify } from "fastify";
import { logger } from "./utils/logger.js";

import { env } from "./utils/env.js";

Error.stackTraceLimit = 50;

export const App = fastify();

async function start() {
  App.log = logger;
  App.listen({
    port: env.BACKEND_PORT,
  });
}

process.on("uncaughtException", (error) => {
  logger.error(error);
});

start();
