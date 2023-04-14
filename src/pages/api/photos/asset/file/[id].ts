import { type NextRequest } from "next/server";
import { config as appConfig } from "../../../../../server/config";
import { parseNonNil } from "../../../../../utils/parsers";

export const config = {
  runtime: "edge",
};

const handler = async (req: NextRequest) => {
  const id = parseNonNil(new URL(req.url).pathname.split("/").at(-1));
  const res = await fetch(`${appConfig.immich.addr}/api/asset/file/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Api-Key": appConfig.immich.apiKey,
    },
  });

  return res;
};

export default handler;
