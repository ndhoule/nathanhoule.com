import { Readable } from "node:stream";
import { type ReadableStream } from "node:stream/web";
import { type NextApiRequest, type NextApiResponse } from "next";
import { config as appConfig } from "../../../../../server/config";

export const config = {
  runtime: "nodejs",
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(400).json({ error: { message: "Malformed ID" } });
    return;
  }

  const proxiedRes = await fetch(
    `${appConfig.immich.addr}/api/asset/thumbnail/${id}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Api-Key": appConfig.immich.apiKey,
      },
    },
  );

  if (proxiedRes.status !== 200 || proxiedRes.body == null) {
    res.status(404);
    return;
  }

  Readable.fromWeb(proxiedRes.body as ReadableStream<Uint8Array>).pipe(res);
};

export default handler;
