import { point } from "@turf/turf";
import React from "react";
import { Layer as MGLLayer, Source as MGLSource } from "react-map-gl";
import { usePhotos } from "../../queries/photos";
import { useControlPanel } from "./ControlPanel";

export type PhotosLayer = React.ComponentProps<typeof PhotosLayer>;

export const PhotosLayer = ({ id }: { id: string }) => {
  const { data } = usePhotos(
    { id },
    {
      placeholderData: () => ({ assets: [] }),
      select: ({ assets }) =>
        ({
          type: "FeatureCollection",
          features: assets.map(({ id, exifInfo, fullUrl, thumbnailUrl }) =>
            point(
              [exifInfo.longitude, exifInfo.latitude],
              {
                id,
                description: exifInfo.description,
                fullUrl,
                imageHeight: exifInfo.imageHeight,
                imageWidth: exifInfo.imageWidth,
                latitude: exifInfo.latitude,
                longitude: exifInfo.longitude,
                thumbnailUrl,
              },
              { id }
            )
          ),
        } as const),
    }
  );
  const {
    overlays: { photos: showPhotos },
  } = useControlPanel();

  return (
    <MGLSource
      id="photo"
      cluster
      clusterMaxZoom={12}
      clusterRadius={50}
      data={data}
      type="geojson"
    >
      <MGLLayer
        id="photo-clusters"
        source="photo"
        filter={["has", "point_count"]}
        type="circle"
        layout={{ visibility: showPhotos ? "visible" : "none" }}
        paint={{
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            100,
            "#f1f075",
            750,
            "#f28cb1",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40,
          ],
        }}
      />
      <MGLLayer
        id="photo-cluster-count"
        source="photo"
        filter={["has", "point_count"]}
        type="symbol"
        layout={{
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
          visibility: showPhotos ? "visible" : "none",
        }}
      />
      <MGLLayer
        id="photo"
        source="photo"
        filter={["!", ["has", "point_count"]]}
        type="circle"
        layout={{ visibility: showPhotos ? "visible" : "none" }}
        paint={{
          "circle-color": "#000",
          "circle-radius": 6,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        }}
      />
    </MGLSource>
  );
};
