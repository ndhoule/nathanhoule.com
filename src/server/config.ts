import moize from "moize";
import { z } from "zod";

const ConfigSchema = z.object({
  garmin: z.object({
    mapShareMapId: z.string().min(1),
    mapSharePassword: z.string().min(1),
  }),
  immich: z.object({
    addr: z.string().min(1),
    albumIdWhitelist: z
      .string()
      .transform((value) => value.split(","))
      .pipe(z.array(z.string().uuid()))
      .transform((values) => new Set(values)),
    apiKey: z.string().min(1),
  }),
});

export type Config = z.output<typeof ConfigSchema>;

export const getConfig = moize((): Config => {
  return ConfigSchema.parse({
    garmin: {
      mapShareMapId: process.env["GARMIN_MAPSHARE_MAP_ID"],
      mapSharePassword: process.env["GARMIN_MAPSHARE_PASSWORD"],
    },
    immich: {
      addr: process.env["IMMICH_ADDR"],
      albumIdWhitelist: process.env["IMMICH_ALBUM_ID_WHITELIST"],
      apiKey: process.env["IMMICH_API_KEY"],
    },
  });
});
