import type { APIRoute } from "astro";
import { ImmichError, getAlbumAssets } from "../../../../server/immich";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const data = await getAlbumAssets(params["id"] ?? "");
    return Response.json({ data });
  } catch (error) {
    if (error instanceof ImmichError) {
      return Response.json(
        { error: { message: error.message } },
        { status: error.status },
      );
    }
    throw error;
  }
};
