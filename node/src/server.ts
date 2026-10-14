import 'dotenv/config'
import fastify from "fastify";
import cors from '@fastify/cors'
import { userRoutes } from './routes/user.routes.ts';
import { tagRoutes } from './routes/tag.routes.ts';

const server = fastify( {
    logger: true
})

await server.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
})

await server.register(userRoutes)
await server.register(tagRoutes)

server.listen({
  port: Number(process.env.PORT) || 3335,
  host: '0.0.0.0',
})