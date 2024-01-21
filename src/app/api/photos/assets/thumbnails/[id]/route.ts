import { config } from "../../../../../../server/config";

export const runtime = "edge";

export const GET = async (
  _req: Request,
  { params }: { params: { id: string } },
): Promise<Response> => {
  const proxiedRes = await fetch(
    `${config.immich.addr}/api/asset/thumbnail/${params.id}`,
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

  return new Response(proxiedRes.body);
};
