import { type GeoJSONSource, setWorkerUrl } from "maplibre-gl";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import React, { useCallback, useRef, useState } from "react";
import {
  AttributionControl as MGLAttributionControl,
  Map as MGLMap,
  type MapRef as MGLMapRef,
  NavigationControl as MGLNavigationControl,
  Popup as MGLPopup,
  ScaleControl as MGLScaleControl,
  type MapLayerMouseEvent,
} from "@vis.gl/react-maplibre";
import { z } from "zod";
import { parseNonNull } from "../../utils/parsers";
import { ControlPanel } from "./ControlPanel";
import * as styles from "./Map.css";
import { PhotosLayer } from "./PhotosLayer";
import { RouteLinesLayer } from "./RouteLinesLayer";
import { TrackLinesLayer } from "./TrackLinesLayer";

// maplibre-gl finds its worker relative to import.meta.url, which changes once Vite bundles it
setWorkerUrl(maplibreWorkerUrl);

const PhotoFeatureSchema = z.object({
  // TODO(ndhoule): Parse and use geometry?
  properties: z.object({
    description: z.string(),
    fullUrl: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    thumbnailUrl: z.string(),
  }),
});

const PhotosClusterFeatureSchema = z.object({
  properties: z.object({
    cluster: z.boolean(),
    cluster_id: z.number(),
  }),
  geometry: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
});

export type MapProps = React.ComponentProps<typeof Map>;

export const Map = ({
  map: mapConfig,
  photoAlbumId,
  tripId,
}: {
  map: {
    initialViewState?:
      | {
          latitude: number;
          longitude: number;
          zoom: number;
        }
      | { bounds: [number, number, number, number] }
      | undefined;
    maxBounds?: [number, number, number, number] | undefined;
  };
  photoAlbumId?: string | undefined;
  tripId?: string | undefined;
}) => {
  const mapRef = useRef<MGLMapRef>(null);

  const [popupInfo, setPopupInfo] = useState<{
    latitude: number;
    longitude: number;
    data: {
      description: string;
      fullUrl: string;
      thumbnailUrl: string;
    };
  } | null>(null);

  const onClick = useCallback((event: MapLayerMouseEvent) => {
    if (event.features != null) {
      for (const rawFeature of event.features) {
        switch (rawFeature.layer.id) {
          case "photo": {
            const feature = PhotoFeatureSchema.parse(rawFeature);

            setPopupInfo({
              latitude: feature.properties.latitude,
              longitude: feature.properties.longitude,
              data: {
                description: feature.properties.description,
                fullUrl: feature.properties.fullUrl,
                thumbnailUrl: feature.properties.thumbnailUrl,
              },
            });

            break;
          }
          case "photo-clusters": {
            const feature = PhotosClusterFeatureSchema.parse(rawFeature);
            const mapRefCurrent = parseNonNull(mapRef.current);

            const clusterId = feature.properties.cluster_id;

            const photoSource = mapRefCurrent.getSource<GeoJSONSource>("photo");

            photoSource
              ?.getClusterExpansionZoom(clusterId)
              .then((zoom) => {
                mapRefCurrent.easeTo({
                  center: feature.geometry.coordinates,
                  duration: 250,
                  zoom,
                });
              })
              .catch(() => {});
            break;
          }
        }
      }
    }
  }, []);

  return (
    <MGLMap
      attributionControl={false}
      initialViewState={mapConfig.initialViewState ?? {}}
      interactiveLayerIds={["photo", "photo-clusters"]}
      mapStyle={`https://api.maptiler.com/maps/topo-v2/style.json?key=${
        import.meta.env.PUBLIC_MAPTILER_API_KEY ?? ""
      }`}
      maxBounds={
        // XXX(ndhoule): This is gross, but it's the easiest way to make
        // `maxBounds` exhibit a `?: | undefined`-like behavior.
        //
        // oxlint-disable-next-line @typescript-eslint/no-non-null-assertion
        mapConfig.maxBounds!
      }
      onClick={onClick}
      ref={mapRef}
      style={{ width: "100%", height: "100%" }}
    >
      <MGLScaleControl position="bottom-left" />
      <MGLAttributionControl compact position="bottom-right" />
      <ControlPanel
        showPhotosSelector={photoAlbumId != null}
        showRoutesSelector={tripId != null}
        showTracksSelector={tripId != null}
      />
      <MGLNavigationControl position="bottom-right" />

      {/* Layers stack in the order they're rendered, so render order is important here. */}
      {tripId != null && <RouteLinesLayer id={tripId} />}
      {tripId != null && <TrackLinesLayer id={tripId} />}
      {photoAlbumId != null && <PhotosLayer id={photoAlbumId} />}

      {popupInfo != null && (
        <MGLPopup
          latitude={popupInfo.latitude}
          longitude={popupInfo.longitude}
          onClose={() => {
            setPopupInfo(null);
          }}
        >
          {/* Popup max width = 220px (240px max-width - 20px L+R padding) */}
          <figure>
            <a
              href={popupInfo.data.fullUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div
                style={{
                  height: 175,
                  position: "relative",
                  width: 220,
                }}
              >
                <img
                  alt=""
                  className={styles.photoPopupImage}
                  decoding="async"
                  loading="lazy"
                  src={popupInfo.data.thumbnailUrl}
                />
              </div>
            </a>
            {popupInfo.data.description !== "" && (
              <figcaption>{popupInfo.data.description}</figcaption>
            )}
            <a
              className={styles.photoPopupImageLink}
              href={popupInfo.data.fullUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              View larger image (opens a new window)
            </a>
          </figure>
        </MGLPopup>
      )}
    </MGLMap>
  );
};
