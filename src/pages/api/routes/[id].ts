import type { APIRoute } from "astro";
import { routes } from "../../../data";

export const prerender = false;

export const GET: APIRoute = ({ params }) => {
  const route = params["id"] == null ? undefined : routes.get(params["id"]);
  if (route == null) {
    return Response.json({ error: { message: "Not Found" } }, { status: 404 });
  }
  return Response.json({ data: route });
};
