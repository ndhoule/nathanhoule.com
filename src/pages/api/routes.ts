import fs from "node:fs";
import path from "node:path";
import { type NextApiRequest, type NextApiResponse } from "next";

export const config = {
  runtime: "nodejs",
};

const ROUTE_FILES = [
  { filename: "jmt_full.json", label: "John Muir Trail" },
  { filename: "pct_full.json", label: "Pacific Crest Trail" },
];

const routes = ROUTE_FILES.map(({ filename, label }) => {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data/routes", filename)
  );
  return {
    id: filename,
    data: JSON.parse(raw.toString("utf8")) as unknown,
    label,
  };
});

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ data: routes });
};

export default handler;
