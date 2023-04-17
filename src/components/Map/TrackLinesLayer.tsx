import { Layer as MGLLayer, Source as MGLSource } from "react-map-gl";
import { useTracks } from "../../queries/tracks";
import { useControlPanel } from "./ControlPanel";

export const TrackLinesLayer = ({ id }: { id: string }) => {
  const { data } = useTracks(
    { id },
    {
      placeholderData: () => ({ tracks: [] }),
      select: ({ tracks }) => tracks,
    }
  );
  const {
    overlays: { tracks: showTracks },
  } = useControlPanel();

  return (
    <>
      {(data ?? []).map(({ id, data }) => (
        <MGLSource key={id} data={data} type="geojson">
          <MGLLayer
            id={`track-${id}`}
            beforeId="photo-clusters"
            source="track"
            type="line"
            layout={{
              "line-cap": "round",
              "line-join": "round",
              visibility: showTracks ? "visible" : "none",
            }}
            paint={{
              "line-color": "#ff0037",
              "line-width": 2,
            }}
          />
        </MGLSource>
      ))}
    </>
  );
};
