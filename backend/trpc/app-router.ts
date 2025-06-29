import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import interpretRoute from "./routes/dreams/interpret/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  dreams: createTRPCRouter({
    interpret: interpretRoute,
  }),
});

export type AppRouter = typeof appRouter;