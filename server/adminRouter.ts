import { z } from "zod";
import { router, publicProcedure } from "./_core/trpc";
import * as db from "./db";

export const adminRouter = router({
  makeUserAdmin: publicProcedure
    .input(z.object({
      email: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      const result = await db.makeUserAdmin(input.email);
      return result;
    }),
});
