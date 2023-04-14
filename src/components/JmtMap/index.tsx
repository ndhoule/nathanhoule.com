import { useEffect, useState } from "react";
import {
  GeoJSON,
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import { type GeoJsonObject } from "../../types/geojson";
import { LegendControl } from "./LegendControl";

const PHOTO_ALBUM_ID = "98c6d823-0f56-498f-9ca3-7a31b81c10e6";

const OSM_ATTRIBUTION =
  "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>";
const MAPTILER_ATTRIBUTION =
  "&copy; <a href='https://www.maptiler.com/copyright/'>Maptiler</a>";

const JmtRouteLayerGroup = () => {
  const [route, setRoute] = useState<GeoJsonObject | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/routes");
      const data = (await res.json()) as {
        data: {
          id: string;
          data: GeoJsonObject;
          label: string;
        }[];
      };
      const route = data.data.find(({ id }) => id === "jmt_full.json");
      setRoute(route?.data ?? null);
    })();
  }, []);

  return (
    <LayerGroup>
      {route != null && <GeoJSON data={route} style={{ dashArray: "4" }} />}
    </LayerGroup>
  );
};

const JmtTracksLayerGroup = () => {
  const [tracks, setTracks] = useState<
    { data: GeoJsonObject; id: string; label: string }[]
  >([]);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/tracks");
      const data = (await res.json()) as {
        data: {
          id: string;
          data: GeoJsonObject;
          label: string;
        }[];
      };
      setTracks(data.data);
    })();
  }, []);

  return (
    <LayerGroup>
      {tracks.map(({ data, id, label }) => (
        <GeoJSON key={id} data={data} style={{ color: "#ff0000", weight: 2.5 }}>
          <Tooltip>{label}</Tooltip>
        </GeoJSON>
      ))}
    </LayerGroup>
  );
};

const PhotosLayerGroup = () => {
  const [photos, setPhotos] = useState<
    {
      id: string;
      exifInfo: { latitude: number; longitude: number };
      fullUrl: string;
      thumbnailUrl: string;
    }[]
  >([]);

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/album/${PHOTO_ALBUM_ID}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = (await res.json()) as {
        assets: {
          id: string;
          exifInfo: { latitude: number; longitude: number };
          fullUrl: string;
          thumbnailUrl: string;
        }[];
      };

      setPhotos(data.assets);
    })();
  }, []);

  return (
    <LayerGroup>
      {photos.map(({ id, exifInfo, fullUrl, thumbnailUrl }) => (
        <Marker key={id} position={[exifInfo.latitude, exifInfo.longitude]}>
          <Popup>
            <a href={fullUrl} target="_blank" rel="noopener noreferrer">
              <img
                // FIXME(ndhoule): Figure out how to provide meaningful alt text
                alt=""
                src={thumbnailUrl}
                loading="lazy"
                style={{ width: "250px" }}
              />
            </a>
          </Popup>
        </Marker>
      ))}
    </LayerGroup>
  );
};

const Map = () => {
  return (
    <MapContainer
      bounds={[
        [37.90124, -119.57239],
        [36.54929, -118.21822],
      ]}
      style={{ height: "100%", width: "100%" }}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Topographic">
          <TileLayer
            attribution={`${MAPTILER_ATTRIBUTION} ${OSM_ATTRIBUTION}`}
            maxZoom={19}
            url={`https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}@2x.png?key=${
              process.env["NEXT_PUBLIC_MAPTILER_API_KEY"] ?? ""
            }`}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            attribution={`${MAPTILER_ATTRIBUTION} ${OSM_ATTRIBUTION}`}
            maxZoom={19}
            url={`https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}@2x.jpg?key=${
              process.env["NEXT_PUBLIC_MAPTILER_API_KEY"] ?? ""
            }`}
          />
        </LayersControl.BaseLayer>

        <LayersControl.Overlay checked name="Route">
          <JmtRouteLayerGroup />
        </LayersControl.Overlay>

        <LayersControl.Overlay checked name="Tracks">
          <JmtTracksLayerGroup />
        </LayersControl.Overlay>

        <LayersControl.Overlay checked name="Photos">
          <PhotosLayerGroup />
        </LayersControl.Overlay>
      </LayersControl>

      <LegendControl
        items={[
          { color: "#ff0000", label: "Track" },
          { color: "#3388ff", label: "JMT Route" },
        ]}
        position="bottomleft"
      />
    </MapContainer>
  );
};

const JmtMap = () => {
  return (
    <div css={{ display: "flex", height: "100%" }}>
      <Map />
    </div>
  );
};

export default JmtMap;
