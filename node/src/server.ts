import 'dotenv/config'
import fastify from "fastify";
import cors from '@fastify/cors'
import { pingRoutes } from './routes/ping.routes.ts';
import { userRoutes } from './routes/user.routes.ts';

const server = fastify( {
    logger: true
})

await server.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
})

await server.register(pingRoutes)
await server.register(userRoutes)

server.listen({
  port: Number(process.env.PORT) || 3335,
  host: '0.0.0.0',
})