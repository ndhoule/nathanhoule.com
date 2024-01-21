import {
  type QueryClient,
  type QueryFunction,
  type UseQueryOptions,
  useQuery,
} from "@tanstack/react-query";
import type GeoJSON from "geojson";
import { z } from "zod";
import { API_BASE_URL } from "./shared";

const CURRENT_LOCATION_QUERY_KEY = "current_location";

type QueryKey = readonly [typeof CURRENT_LOCATION_QUERY_KEY, { id: string }];

const UseCurrentLocationDataSchema = z
  // FIXME(ndhoule): Validate this data better
  .record(z.unknown())
  .nullable()
  .transform((value = null) => value as GeoJSON.FeatureCollection | null);

export type UseCurrentLocationData = z.output<
  typeof UseCurrentLocationDataSchema
>;

const UseCurrentLocationErrorDataSchema = z.object({
  message: z.string().min(1),
});

export type UseCurrentLocationErrorData = z.output<
  typeof UseCurrentLocationErrorDataSchema
>;

const UseCurrentLocationSuccessSchema = z.object({
  data: UseCurrentLocationDataSchema,
  error: z.null().default(null),
});

const UseCurrentLocationErrorSchema = z.object({
  data: z.null().default(null),
  error: z.object({
    message: z.string().min(1),
  }),
});

const queryFn: QueryFunction<UseCurrentLocationData, QueryKey> = async ({
  signal,
  queryKey: [, { id }],
}) => {
  const res = await fetch(`${API_BASE_URL}/tracks/${id}/current_location`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
    signal,
  });

  if (res.status !== 200) {
    const result = UseCurrentLocationErrorSchema.safeParse(await res.json());
    if (result.success) {
      throw new Error(result.data.error.message);
    }
    throw new Error("Unknown error: Failed to deserialize error response");
  }

  const result = UseCurrentLocationSuccessSchema.safeParse(await res.json());
  if (!result.success) {
    throw new Error("Unknown error: Failed to deserialize response data");
  }
  return result.data.data;
};

export const useCurrentLocation = <TData = UseCurrentLocationData>(
  { id }: { id: string },
  options: Omit<
    UseQueryOptions<
      UseCurrentLocationData,
      UseCurrentLocationErrorData,
      TData,
      QueryKey
    >,
    "initialData" | "queryKey" | "queryFn"
  > = {},
) =>
  useQuery<
    UseCurrentLocationData,
    UseCurrentLocationErrorData,
    TData,
    QueryKey
  >({
    queryFn,
    queryKey: [CURRENT_LOCATION_QUERY_KEY, { id }],
    ...options,
  });

export const prefetchCurrentLocation = async <TData = UseCurrentLocationData>(
  queryClient: QueryClient,
  { id }: { id: string },
) => {
  await queryClient.prefetchQuery<
    UseCurrentLocationData,
    UseCurrentLocationErrorData,
    TData,
    QueryKey
  >({
    queryKey: [CURRENT_LOCATION_QUERY_KEY, { id }],
    queryFn,
  });
};
