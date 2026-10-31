import { getSecret } from "astro:env/server";
import { z } from "zod";

const ConfigSchema = z.object({
  immich: z.object({
    addr: z.string().min(1),
    albumIdWhitelist: z
      .string()
      .transform((value) => value.split(","))
      .pipe(z.array(z.uuid()))
      .transform((values) => new Set(values)),
    apiKey: z.string().min(1),
  }),
});

export type Config = z.output<typeof ConfigSchema>;

let config: Config | undefined;

export const getConfig = (): Config => {
  config ??= ConfigSchema.parse({
    immich: {
      addr: getSecret("IMMICH_ADDR"),
      albumIdWhitelist: getSecret("IMMICH_ALBUM_ID_WHITELIST"),
      apiKey: getSecret("IMMICH_API_KEY"),
    },
  });
  return config;
};
