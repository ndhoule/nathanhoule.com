import { routes } from "../../../data";

export const runtime = "edge";

export const GET = (_req: Request): Response =>
  Response.json({ data: Array.from(routes.values()) });
