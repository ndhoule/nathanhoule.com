import fs from "node:fs";
import path from "node:path";
import toGeoJson from "@mapbox/togeojson";
import { type NextApiRequest, type NextApiResponse } from "next";
import { parse as parseDom } from "node-html-parser";

export const config = {
  runtime: "nodejs",
};

const TRACK_FILES = [
  { filename: "JMT_Day_1.gpx", label: "Day 1" },
  { filename: "JMT_Day_2_1.gpx", label: "Day 2 (Part 1)" },
  { filename: "JMT_Day_2_2.gpx", label: "Day 2 (Part 2)" },
  { filename: "JMT_Day_3.gpx", label: "Day 3" },
  { filename: "JMT_Day_4.gpx", label: "Day 4" },
  { filename: "JMT_Day_5.gpx", label: "Day 5" },
  { filename: "JMT_Day_6.gpx", label: "Day 6" },
  { filename: "JMT_Day_7.gpx", label: "Day 7" },
  { filename: "JMT_Day_8.gpx", label: "Day 8" },
  { filename: "JMT_Day_9.gpx", label: "Day 9" },
  { filename: "JMT_Day_10.gpx", label: "Day 10" },
  { filename: "JMT_Day_11.gpx", label: "Day 11" },
  { filename: "JMT_Day_12.gpx", label: "Day 12" },
  {
    filename: "JMT_Escape_Mt_Whitney_Summit_to_Whitney_Portal_.gpx",
    label: "Day 12 (Whitney Escape)",
  },
];

const tracks = TRACK_FILES.map(({ filename, label }) => {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data/tracks", filename)
  );
  const xml = parseDom(raw.toString("utf8"));
  const data = toGeoJson.gpx(xml as unknown as HTMLElement);

  return {
    id: filename,
    data,
    label,
  };
});

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ data: tracks });
};

export default handler;
