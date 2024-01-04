import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type GeoJSON from "geojson";
import { z } from "zod";
import { API_BASE_URL } from "./shared";

const ROUTE_QUERY_KEY = "route";

const UseRouteByIdDataSchema = z.object({
  id: z.string().min(1),
  // FIXME(ndhoule): Validate this data
  data: z.unknown().transform((value) => value as GeoJSON.FeatureCollection),
  label: z.string().min(1),
});

export type UseRouteByIdData = z.output<typeof UseRouteByIdDataSchema> | null;

const UseRouteByIdErrorDataSchema = z.object({
  message: z.string().min(1),
});

export type UseRouteByIdErrorData = z.output<
  typeof UseRouteByIdErrorDataSchema
>;

const UseRouteByIdSuccessSchema = z.object({
  data: UseRouteByIdDataSchema,
  error: z.null().default(null),
});

const UseRouteByIdErrorSchema = z.object({
  data: z.null().default(null),
  error: z.object({
    message: z.string().min(1),
  }),
});

export const useRouteById = <TData = UseRouteByIdData>(
  { id }: { id: string },
  options: Omit<
    UseQueryOptions<UseRouteByIdData, UseRouteByIdErrorData, TData>,
    "initialData" | "queryKey" | "queryFn"
  > = {},
) =>
  useQuery<UseRouteByIdData, UseRouteByIdErrorData, TData>({
    queryFn: async ({ signal }) => {
      const res = await fetch(`${API_BASE_URL}/routes/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
        signal,
      });

      if (res.status !== 200) {
        if (res.status === 404) {
          return null;
        }

        const result = UseRouteByIdErrorSchema.safeParse(await res.json());
        if (result.success) {
          throw new Error(result.data.error.message);
        }
        throw new Error("Unknown error: Failed to deserialize error response");
      }

      const result = UseRouteByIdSuccessSchema.safeParse(await res.json());
      if (!result.success) {
        throw new Error("Unknown error: Failed to deserialize response data");
      }
      return result.data.data;
    },
    queryKey: [ROUTE_QUERY_KEY, id],
    ...options,
  });
