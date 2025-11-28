import { z } from "zod";
import { router, publicProcedure } from "./_core/trpc";
import * as db from "./db";

export const adminRouter = router({
  createUser: publicProcedure
    .input(z.object({ 
      email: z.string().email(),
      password: z.string(),
      name: z.string()
    }))
    .mutation(async ({ input }) => {
      await db.createUser(input.email, input.password, input.name);
      return { success: true };
    }),

  makeUserAdmin: publicProcedure
    .input(z.object({
      email: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      const result = await db.makeUserAdmin(input.email);
      return result;
    }),
});
