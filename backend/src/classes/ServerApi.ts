import type { FastifyInstance } from "fastify";

export class ServerApi {
  fastify: FastifyInstance | undefined;

  // constructor(fastify: FastifyInstance) {}

  public async init() {
    await this.SetupRoutes();
  }

  private async SetupRoutes() {}
}
