import type { APIRoute } from "astro";
import { getConfig } from "../../../../../server/config";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const config = getConfig();

  const proxiedRes = await fetch(
    `${config.immich.addr}/api/assets/${params["id"] ?? ""}/original`,
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

  if (proxiedRes.body == null) {
    return Response.json({ error: { message: "Not Found" } }, { status: 404 });
  }

  const contentType = proxiedRes.headers.get("Content-Type");
  return new Response(proxiedRes.body, {
    headers: contentType == null ? {} : { "Content-Type": contentType },
  });
};
