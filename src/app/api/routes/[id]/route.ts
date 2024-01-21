import { routes } from "../../../../data";

export const runtime = "edge";

export const GET = (
  _req: Request,
  { params }: { params: { id: string } },
): Response => {
  const route = routes.get(params.id);
  if (route == null) {
    return Response.json({ error: { message: "Not Found" } }, { status: 404 });
  }
  return Response.json({ data: route }, { status: 404 });
};
