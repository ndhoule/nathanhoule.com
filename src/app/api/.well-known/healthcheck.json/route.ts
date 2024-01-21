export const runtime = "edge";

export const GET = async (_req: Request): Promise<Response> =>
  Promise.resolve(Response.json({ data: { ok: true } }));
