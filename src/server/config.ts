import { z } from "zod";

const Config = z.object({
  immich: z.object({
    addr: z.string().nonempty(),
    apiKey: z.string().nonempty(),
  }),
});

export const config = Config.parse({
  immich: {
    addr: process.env["IMMICH_BASE_URL"],
    apiKey: process.env["IMMICH_API_KEY"],
  },
});
