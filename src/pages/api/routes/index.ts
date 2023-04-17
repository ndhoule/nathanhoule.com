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
          path.join(process.cwd(), "data/routes/jmt_full.json"),
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

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ data: routes.values() });
};

export default handler;
