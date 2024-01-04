import { type NextApiRequest, type NextApiResponse } from "next";
import { config as appConfig } from "../../../../server/config";
import { parseNonNil } from "../../../../utils/parsers";

export const config = {
  runtime: "nodejs",
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(400).json({ error: { message: "Malformed ID" } });
    return;
  }

  if (!appConfig.immich.albumIdWhitelist.has(id)) {
    res.status(404).json({ error: { message: "Not Found" } });
    return;
  }

  const proxiedRes = await fetch(`${appConfig.immich.addr}/api/album/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Api-Key": appConfig.immich.apiKey,
    },
  });

  if (!proxiedRes.ok) {
    if (proxiedRes.status === 404) {
      res.status(404).json({ error: { message: "Not Found" } });
      return;
    }

    res.status(500).json({ error: { message: "Internal Error" } });
    return;
  }

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
      fullUrl: `/api/photos/asset/file/${id}`,
      thumbnailUrl: `/api/photos/asset/thumbnail/${id}`,
    }));

  res.status(200).json({ data: { assets } });
};

export default handler;
