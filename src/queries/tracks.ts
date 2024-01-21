import {
  type QueryClient,
  type QueryFunction,
  type UseQueryOptions,
  useQuery,
} from "@tanstack/react-query";
import type GeoJSON from "geojson";
import { z } from "zod";
import { API_BASE_URL } from "./shared";

const TRACKS_QUERY_KEY = "tracks";

type QueryKey = readonly [typeof TRACKS_QUERY_KEY, { id: string }];

const UseTracksDataSchema = z.object({
  tracks: z.array(
    z.object({
      id: z.string().min(1),
      // FIXME(ndhoule): Validate this data
      data: z
        .unknown()
        .transform((value) => value as GeoJSON.FeatureCollection),
    }),
  ),
});

export type UseTracksData = z.output<typeof UseTracksDataSchema>;

const UseTracksErrorDataSchema = z.object({
  message: z.string().min(1),
});

export type UseTracksErrorData = z.output<typeof UseTracksErrorDataSchema>;

const UseTracksSuccessSchema = z.object({
  data: UseTracksDataSchema,
  error: z.null().default(null),
});

const UseTracksErrorSchema = z.object({
  data: z.null().default(null),
  error: z.object({
    message: z.string().min(1),
  }),
});

const queryFn: QueryFunction<UseTracksData, QueryKey> = async ({
  signal,
  queryKey: [, { id }],
}) => {
  const res = await fetch(`${API_BASE_URL}/tracks/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
    signal,
  });

  if (res.status !== 200) {
    const result = UseTracksErrorSchema.safeParse(await res.json());
    if (result.success) {
      throw new Error(result.data.error.message);
    }
    throw new Error("Unknown error: Failed to deserialize error response");
  }

  const result = UseTracksSuccessSchema.safeParse(await res.json());
  if (!result.success) {
    throw new Error("Unknown error: Failed to deserialize response data");
  }
  return result.data.data;
};

export const useTracks = <TData = UseTracksData>(
  { id }: { id: string },
  options: Omit<
    UseQueryOptions<UseTracksData, UseTracksErrorData, TData, QueryKey>,
    "initialData" | "queryKey" | "queryFn"
  > = {},
) =>
  useQuery<UseTracksData, UseTracksErrorData, TData, QueryKey>({
    queryFn,
    queryKey: [TRACKS_QUERY_KEY, { id }],
    ...options,
  });

export const prefetchTracks = async <TData = UseTracksData>(
  queryClient: QueryClient,
  { id }: { id: string },
) => {
  await queryClient.prefetchQuery<
    UseTracksData,
    UseTracksErrorData,
    TData,
    QueryKey
  >({
    queryKey: [TRACKS_QUERY_KEY, { id }],
    queryFn,
  });
};
