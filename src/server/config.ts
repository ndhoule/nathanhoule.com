import { z } from "zod";

const Config = z.object({
  immich: z.object({
    addr: z.string().nonempty(),
    albumIdWhitelist: z
      .string()
      .transform((value) => value.split(","))
      .pipe(z.array(z.string().uuid()))
      .transform((values) => new Set(values)),
    apiKey: z.string().nonempty(),
  }),
});

export const config = Config.parse({
  immich: {
    addr: process.env["IMMICH_ADDR"],
    albumIdWhitelist: process.env["IMMICH_ALBUM_ID_WHITELIST"],
    apiKey: process.env["IMMICH_API_KEY"],
  },
});
