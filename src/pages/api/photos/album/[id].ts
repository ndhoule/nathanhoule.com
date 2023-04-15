import { type NextRequest } from "next/server";
import { config as appConfig } from "../../../../server/config";
import { parseNonNil } from "../../../../utils/parsers";

export const config = {
  runtime: "edge",
};

const handler = async (req: NextRequest) => {
  const id = parseNonNil(
    new URL(req.url).pathname.split("/").at(-1)
  ).toLowerCase();

  if (!appConfig.immich.albumIdWhitelist.has(id)) {
    return new Response(JSON.stringify({ error: { message: "Not Found" } }), {
      headers: { "Content-Type": "application/json" },
      status: 404,
    });
  }

  const res = await fetch(`${appConfig.immich.addr}/api/album/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Api-Key": appConfig.immich.apiKey,
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return new Response(JSON.stringify({ error: { message: "Not Found" } }), {
        headers: { "Content-Type": "application/json" },
        status: res.status,
      });
    }

    return new Response(
      JSON.stringify({ error: { message: "Internal Error" } }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }

  const data = (await res.json()) as {
    assets: {
      id: string;
      exifInfo: {
        latitude: number | null;
        longitude: number | null;
      } | null;
      type: string;
    }[];
  };
  const assets = data.assets
    // Remove any non-image assets and any assets that can't be plotted on a map
    .filter(
      ({ exifInfo, type }) =>
        exifInfo?.latitude != null &&
        exifInfo.longitude != null &&
        type === "IMAGE"
    )
    .map(({ id, exifInfo }) => ({
      id,
      exifInfo: {
        latitude: parseNonNil(exifInfo?.latitude),
        longitude: parseNonNil(exifInfo?.longitude),
      },
      fullUrl: `/api/photos/asset/file/${id}`,
      thumbnailUrl: `/api/photos/asset/thumbnail/${id}`,
    }));

  return new Response(JSON.stringify({ assets }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
};

export default handler;
