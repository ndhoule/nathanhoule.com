"use client";

import { parseISO as parseISODate } from "date-fns";
import ms from "ms";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  GeoJSONSource,
  AttributionControl as MGLAttributionControl,
  Map as MGLMap,
  MapRef as MGLMapRef,
  NavigationControl as MGLNavigationControl,
  Popup as MGLPopup,
  ScaleControl as MGLScaleControl,
  MapLayerMouseEvent,
} from "react-map-gl/maplibre";
import { z } from "zod";
import { parseNonNull } from "../../utils/parsers";
import { ControlPanel } from "./ControlPanel";
import { CurrentLocationMarker } from "./CurrentLocationMarker";
import * as styles from "./Map.css";
import { PhotosLayer } from "./PhotosLayer";
import { RouteLinesLayer } from "./RouteLinesLayer";
import { TrackLinesLayer } from "./TrackLinesLayer";

const CurrentLocationFeatureSchema = z.object({
  // TODO(ndhoule): Parse and use geometry?
  properties: z.object({
    latitude: z.number(),
    longitude: z.number(),
    timestamp: z.string(),
  }),
});

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
  tripEnd,
  tripId,
  tripStart,
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
  tripEnd?: string | undefined;
  tripId?: string | undefined;
  tripStart?: string | undefined;
}) => {
  const mapRef = useRef<MGLMapRef>(null);

  const [now, setNow] = useState(new Date().toISOString());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date().toISOString());
    }, ms("1m"));
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const isTripInProgress =
    tripStart != null && tripEnd != null
      ? now >= tripStart && now <= tripEnd
      : false;

  const [popupInfo, setPopupInfo] = useState<{
    latitude: number;
    longitude: number;
    data:
      | { type: "current-location"; timestamp: string }
      | {
          type: "photo";
          description: string;
          fullUrl: string;
          thumbnailUrl: string;
        };
  } | null>(null);

  const onClick = useCallback((event: MapLayerMouseEvent) => {
    if (event.features != null) {
      for (const rawFeature of event.features) {
        switch (rawFeature.layer.id) {
          case "current-location": {
            const feature = CurrentLocationFeatureSchema.parse(rawFeature);

            setPopupInfo({
              latitude: feature.properties.latitude,
              longitude: feature.properties.longitude,
              data: {
                type: "current-location",
                timestamp: feature.properties.timestamp,
              },
            });

            break;
          }
          case "photo": {
            const feature = PhotoFeatureSchema.parse(rawFeature);

            setPopupInfo({
              latitude: feature.properties.latitude,
              longitude: feature.properties.longitude,
              data: {
                type: "photo",
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

            const mapboxSource = mapRefCurrent.getSource(
              "photo",
            ) as GeoJSONSource;

            mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err != null) {
                return;
              }

              mapRefCurrent.easeTo({
                center: feature.geometry.coordinates,
                duration: 250,
                // @ts-expect-error(ndhoule): The type on this should really be
                // `zoom?: zoom | undefined`
                zoom,
              });
            });
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
      interactiveLayerIds={["current-location", "photo", "photo-clusters"]}
      mapStyle={`https://api.maptiler.com/maps/topo-v2/style.json?key=${
        process.env["NEXT_PUBLIC_MAPTILER_API_KEY"] ?? ""
      }`}
      maxBounds={
        // XXX(ndhoule): This is gross, but it's the easiest way to make
        // `maxBounds` exhibit a `?: | undefined`-like behavior.
        //
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        mapConfig.maxBounds!
      }
      onClick={onClick}
      ref={mapRef}
      style={{ width: "100%", height: "100%" }}
    >
      <MGLScaleControl position="bottom-left" />
      <MGLAttributionControl compact position="bottom-right" />
      <ControlPanel
        showCurrentLocationSelector={isTripInProgress}
        showPhotosSelector={photoAlbumId != null}
        showRoutesSelector={tripId != null}
        showTracksSelector={tripId != null}
      />
      <MGLNavigationControl position="bottom-right" />

      {/* Layers stack in the order they're rendered, so render order is important here. */}
      {tripId != null && <RouteLinesLayer id={tripId} />}
      {tripId != null && <TrackLinesLayer id={tripId} />}
      {photoAlbumId != null && <PhotosLayer id={photoAlbumId} />}
      {isTripInProgress && tripId != null && (
        <CurrentLocationMarker id={tripId} />
      )}

      {popupInfo != null && (
        <MGLPopup
          latitude={popupInfo.latitude}
          longitude={popupInfo.longitude}
          onClose={() => {
            setPopupInfo(null);
          }}
        >
          {(() => {
            const { data } = popupInfo;

            switch (data.type) {
              case "current-location": {
                return (
                  <div>
                    <div className={styles.locationPopupText}>
                      Current Location
                    </div>
                    <div>
                      Recorded at:{" "}
                      {parseISODate(data.timestamp).toLocaleString()}
                    </div>
                  </div>
                );
              }
              case "photo": {
                // Popup max width = 220px (240px max-width - 20px L+R padding)
                return (
                  <figure>
                    <a
                      href={data.fullUrl}
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
                        <Image
                          alt=""
                          className={styles.photoPopupImage}
                          fill
                          src={data.thumbnailUrl}
                        />
                      </div>
                    </a>
                    {data.description !== "" && (
                      <figcaption>{data.description}</figcaption>
                    )}
                    <a
                      className={styles.photoPopupImageLink}
                      href={data.fullUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      View larger image (opens a new window)
                    </a>
                  </figure>
                );
              }
              default: {
                throw new Error("Unknown popup type");
              }
            }
          })()}
        </MGLPopup>
      )}
    </MGLMap>
  );
};
