import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React from "react";
import { prefetchCurrentLocation } from "../../queries/current_location";
import { prefetchPhotos } from "../../queries/photos";
import { prefetchRouteById } from "../../queries/route_by_id";
import { Map as BaseMap, type MapProps as BaseMapProps } from "./Map";
import * as styles from "./index.css";

export type MapProps = React.ComponentProps<typeof Map>;

export const Map = async (props: BaseMapProps) => {
  const queryClient = new QueryClient();

  const pCurrentLocationQuery =
    props.tripId != null
      ? prefetchCurrentLocation(queryClient, { id: props.tripId })
      : Promise.resolve();
  const pRouteByIdQuery =
    props.tripId != null
      ? prefetchRouteById(queryClient, { id: props.tripId })
      : Promise.resolve();
  const pPhotosQuery =
    props.photoAlbumId != null
      ? prefetchPhotos(queryClient, { id: props.photoAlbumId })
      : Promise.resolve();

  await Promise.all([pCurrentLocationQuery, pRouteByIdQuery, pPhotosQuery]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={styles.mapOuterContainer}>
        <div className={styles.mapInnerContainer}>
          <BaseMap {...props} />
        </div>
      </div>
    </HydrationBoundary>
  );
};
