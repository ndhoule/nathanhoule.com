import fs from "node:fs";
import path from "node:path";
import type GeoJSON from "geojson";
import { type NextApiRequest, type NextApiResponse } from "next";

export const config = {
  runtime: "nodejs",
};

const routes = new Map([
  [
    "pacific-crest-trail",
    {
      id: "pacific-crest-trail",
      label: "Pacific Crest Trail",
      data: JSON.parse(
        fs.readFileSync(
          path.join(process.cwd(), "data/routes/pct_full.json"),
          "utf8"
        )
      ) as GeoJSON.FeatureCollection,
    },
  ],
  [
    "john-muir-trail",
    {
      id: "john-muir-trail",
      label: "John Muir Trail",
      data: JSON.parse(
        fs.readFileSync(
          path.join(process.cwd(), "data/routes/jmt_full.json"),
          "utf8"
        )
      ) as GeoJSON.FeatureCollection,
    },
  ],
]);

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: { message: "Malformed ID" } });
  }

  const route = routes.get(id);
  if (route == null) {
    return res.status(404).json({ error: { message: "Not Found" } });
  }

  return res.status(200).json({ data: route });
};

export default handler;
