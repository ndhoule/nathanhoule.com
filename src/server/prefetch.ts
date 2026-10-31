import {
  type DehydratedState,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { routes } from "../data";
import { photosQueryKey } from "../queries/photos";
import { routeByIdQueryKey } from "../queries/route_by_id";
import { getAlbumAssets } from "./immich";

export const prefetchMapData = async ({
  photoAlbumId,
  tripId,
}: {
  photoAlbumId?: string | undefined;
  tripId?: string | undefined;
}): Promise<DehydratedState> => {
  const queryClient = new QueryClient();

  // dehydrate() skips failed queries, so the client fetches those itself.
  await Promise.all([
    tripId != null &&
      queryClient
        .query({
          queryKey: routeByIdQueryKey({ id: tripId }),
          queryFn: () => routes.get(tripId) ?? null,
        })
        .catch(() => {}),
    photoAlbumId != null &&
      queryClient
        .query({
          queryKey: photosQueryKey({ id: photoAlbumId }),
          queryFn: async () => getAlbumAssets(photoAlbumId),
        })
        .catch(() => {}),
  ]);

  return dehydrate(queryClient);
};
