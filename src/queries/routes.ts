import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type GeoJSON from "geojson";
import { z } from "zod";
import { API_BASE_URL } from "./shared";

const ROUTES_QUERY_KEY = "routes";

const UseRoutesDataSchema = z.array(
  z.object({
    id: z.string().nonempty(),
    // FIXME(ndhoule): Validate this data
    data: z.unknown().transform((value) => value as GeoJSON.FeatureCollection),
    label: z.string().nonempty(),
  }),
);

export type UseRoutesData = z.output<typeof UseRoutesDataSchema>;

const UseRoutesErrorDataSchema = z.object({
  message: z.string().nonempty(),
});

export type UseRoutesErrorData = z.output<typeof UseRoutesErrorDataSchema>;

const UseRoutesSuccessSchema = z.object({
  data: UseRoutesDataSchema,
  error: z.null().default(null),
});

const UseRoutesErrorSchema = z.object({
  data: z.null().default(null),
  error: z.object({
    message: z.string().nonempty(),
  }),
});

export const useRoutes = <TData = UseRoutesData>(
  options: Omit<
    UseQueryOptions<UseRoutesData, UseRoutesErrorData, TData>,
    "initialData" | "queryKey" | "queryFn"
  > = {},
) =>
  useQuery<UseRoutesData, UseRoutesErrorData, TData>({
    queryFn: async ({ signal }) => {
      const res = await fetch(`${API_BASE_URL}/routes`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
        signal: signal ?? null,
      });

      if (res.status !== 200) {
        const result = UseRoutesErrorSchema.safeParse(await res.json());
        if (result.success) {
          throw new Error(result.data.error.message);
        }
        throw new Error("Unknown error: Failed to deserialize error response");
      }

      const result = UseRoutesSuccessSchema.safeParse(await res.json());
      if (!result.success) {
        throw new Error("Unknown error: Failed to deserialize response data");
      }
      return result.data.data;
    },
    queryKey: [ROUTES_QUERY_KEY],
    ...options,
  });
