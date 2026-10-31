import type { APIRoute } from "astro";
import { routes } from "../../../data";

export const prerender = false;

export const GET: APIRoute = () =>
  Response.json({ data: [...routes.values()] });
