import { getConfig } from "../../../../../server/config";
import { parseNonNil } from "../../../../../utils/parsers";

export const runtime = "edge";

export const GET = async (
  _req: Request,
  { params }: { params: { id: string } },
): Promise<Response> => {
  const config = getConfig();

  if (!config.immich.albumIdWhitelist.has(params.id)) {
    return Response.json({ error: { message: "Not Found" } }, { status: 404 });
  }

  const proxiedRes = await fetch(
    `${config.immich.addr}/api/album/${params.id}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Api-Key": config.immich.apiKey,
      },
    },
  );

  if (!proxiedRes.ok) {
    if (proxiedRes.status === 404) {
      return Response.json(
        { error: { message: "Not Found" } },
        { status: 404 },
      );
    }

    return Response.json(
      { error: { message: "Internal Error" } },
      { status: 500 },
    );
  }

  // TODO(ndhoule): Parse response using a schema
  const data = (await proxiedRes.json()) as {
    assets: {
      id: string;
      exifInfo: {
        description: string | null;
        exifImageHeight: number | null;
        exifImageWidth: number | null;
        latitude: number | null;
        longitude: number | null;
      } | null;
      type: "IMAGE" | "VIDEO" | "AUDIO" | "OTHER";
    }[];
  };

  const assets = data.assets
    .filter(
      ({ exifInfo, type }) =>
        exifInfo?.exifImageWidth != null &&
        exifInfo.exifImageHeight != null &&
        exifInfo.latitude != null &&
        exifInfo.longitude != null &&
        // TODO(ndhoule): Support videos on frontend
        type === "IMAGE",
    )
    .map(({ id, exifInfo }) => ({
      id,
      exifInfo: {
        description: exifInfo?.description?.trim() ?? "",
        imageHeight: parseNonNil(exifInfo?.exifImageHeight),
        imageWidth: parseNonNil(exifInfo?.exifImageWidth),
        latitude: parseNonNil(exifInfo?.latitude),
        longitude: parseNonNil(exifInfo?.longitude),
      },
      fullUrl: `/api/photos/assets/files/${id}`,
      thumbnailUrl: `/api/photos/assets/thumbnails/${id}`,
    }));

  return Response.json({ data: { assets } });
};
