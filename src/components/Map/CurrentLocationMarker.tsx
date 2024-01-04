import ms from "ms";
import { useState } from "react";
import { Layer as MGLLayer, Source as MGLSource, useMap } from "react-map-gl";
import { useCurrentLocation } from "../../queries/current_location";
import { parseNonUndefined } from "../../utils/parsers";
import { useControlPanel } from "./ControlPanel";

const createDefaultLocationData = (): GeoJSON.FeatureCollection => ({
  features: [],
  type: "FeatureCollection",
});

export const CurrentLocationMarker = ({ id }: { id: string }) => {
  const mapRef = useMap();

  const [hasCenteredOnLocation, setHasCenteredOnLocation] = useState(false);

  const { data } = useCurrentLocation(
    { id },
    {
      placeholderData: () => null,
      refetchInterval: ms("5m"),
      refetchOnWindowFocus: true,
      onSuccess: (data) => {
        // On first load (and only on first load), pan to current location
        if (!hasCenteredOnLocation && mapRef.current != null && data != null) {
          const feature = data.features.at(0);
          if (
            feature != null &&
            feature.geometry.type === "Point" &&
            feature.geometry.coordinates.length >= 2
          ) {
            mapRef.current.easeTo({
              center: [
                parseNonUndefined(feature.geometry.coordinates[0]),
                parseNonUndefined(feature.geometry.coordinates[1]),
              ],
              duration: 2000,
              zoom: 11,
            });
            setHasCenteredOnLocation(true);
          }
        }
      },
    },
  );
  const {
    overlays: { currentLocation: showCurrentLocation },
  } = useControlPanel();

  return (
    <MGLSource
      id="current-location"
      data={data ?? createDefaultLocationData()}
      type="geojson"
    >
      <MGLLayer
        id="current-location"
        source="current-location"
        type="symbol"
        layout={{
          "icon-image": "star_11",
          "icon-size": 2,
          visibility: showCurrentLocation ? "visible" : "none",
        }}
      />
    </MGLSource>
  );
};
