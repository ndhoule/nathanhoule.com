import { parseNonNil } from "../utils/parsers";
import { getConfig } from "./config";

export class ImmichError extends Error {
  public readonly status: 404 | 500;

  public constructor(status: 404 | 500) {
    super(status === 404 ? "Not Found" : "Internal Error");
    this.name = "ImmichError";
    this.status = status;
  }
}

export const getAlbumAssets = async (albumId: string) => {
  const config = getConfig();

  if (!config.immich.albumIdWhitelist.has(albumId)) {
    throw new ImmichError(404);
  }

  const proxiedRes = await fetch(
    `${config.immich.addr}/api/albums/${albumId}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Api-Key": config.immich.apiKey,
      },
    },
  );

  if (!proxiedRes.ok) {
    throw new ImmichError(proxiedRes.status === 404 ? 404 : 500);
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

  return { assets };
};
