import type GeoJSON from "geojson";
import { Layer as MGLLayer, Source as MGLSource } from "react-map-gl";
import { useRouteById } from "../../queries/route_by_id";
import { useControlPanel } from "./ControlPanel";

const createDefaultRouteData = (): GeoJSON.FeatureCollection => ({
  features: [],
  type: "FeatureCollection",
});

export const RouteLinesLayer = ({ id }: { id: string }) => {
  const { data } = useRouteById(
    { id },
    {
      placeholderData: () => ({
        id: "loading",
        label: "Loading",
        data: createDefaultRouteData(),
      }),
      select: (data) => data?.data ?? createDefaultRouteData(),
    }
  );

  const {
    overlays: { routes: showRoutes },
  } = useControlPanel();

  return (
    <MGLSource type="geojson" data={data ?? createDefaultRouteData()}>
      <MGLLayer
        id="route"
        source="route"
        type="line"
        layout={{
          "line-join": "round",
          "line-cap": "round",
          visibility: showRoutes ? "visible" : "none",
        }}
        paint={{
          "line-color": "#888",
          "line-width": 8,
        }}
      />
    </MGLSource>
  );
};
