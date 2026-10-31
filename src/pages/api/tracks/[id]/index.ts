import pfs from "node:fs/promises";
import path from "node:path";
import { gpx as gpxToGeoJSON } from "@tmcw/togeojson";
import { DOMParser } from "@xmldom/xmldom";
import type { APIRoute } from "astro";

export const prerender = false;

const TRACKS_DIR = path.join(process.cwd(), "data/tracks");

// TODO(ndhoule): Split into a memoized TTL'd directory+file-reading function
// and a second unmemoized filterer
const readTracksUncached = async (start: string, end: string) => {
  const dir = await pfs.readdir(TRACKS_DIR);
  const filenamesByBasename = dir.reduce((filenamesByBasename, name) => {
    const basename = name
      .replace(path.extname(name), "")
      .replace(/_(details|summary)$/u, "");
    return filenamesByBasename.set(basename, [
      ...(filenamesByBasename.get(basename) ?? []),
      name,
    ]);
  }, new Map<string, string[]>());

  const paths = [...filenamesByBasename.entries()]
    .map(([basename, filenames]) => {
      const gpxFilename = filenames.find((filename) =>
        filename.endsWith(".gpx"),
      );
      const summaryFilename = filenames.find((filename) =>
        filename.endsWith("_summary.json"),
      );
      return [basename, gpxFilename, summaryFilename] as const;
    })
    .filter((paths): paths is [string, string, string] => {
      const [, gpxFilename, summaryFilename] = paths;
      if (gpxFilename == null || summaryFilename == null) {
        return false;
      }
      return true;
    })
    .filter(([basename]) => basename >= start && basename < end)
    .map(
      ([basename, gpxFilename, summaryFilename]) =>
        [
          basename,
          path.join(TRACKS_DIR, gpxFilename),
          path.join(TRACKS_DIR, summaryFilename),
        ] as const,
    );

  const data = await Promise.all(
    paths.map(async ([id, gpxFilepath, summaryFilepath]) => {
      const [rawGPX, rawSummary] = await Promise.all([
        pfs.readFile(gpxFilepath, { encoding: "utf8" }),
        pfs.readFile(summaryFilepath, { encoding: "utf8" }),
      ]);
      const summary = JSON.parse(rawSummary) as {
        activityTypeDTO: { typeKey: string };
      };
      const xml = new DOMParser().parseFromString(rawGPX, "text/xml");
      const geoJSON = gpxToGeoJSON(xml);
      return {
        id,
        data: geoJSON,
        metadata: {
          activityType: summary.activityTypeDTO.typeKey,
        },
      };
    }),
  );
  return data.filter(({ metadata }) => metadata.activityType === "hiking");
};

const tracksCache = new Map<string, ReturnType<typeof readTracksUncached>>();

const readTracks = async (start: string, end: string) => {
  const key = `${start}/${end}`;
  let tracks = tracksCache.get(key);
  if (tracks == null) {
    // Evict failures so a transient read error isn't cached forever.
    tracks = readTracksUncached(start, end).catch((error: unknown) => {
      tracksCache.delete(key);
      throw error;
    });
    tracksCache.set(key, tracks);
  }
  return tracks;
};

const tracksById = new Map<string, [string, string]>([
  ["john-muir-trail", ["2020-07-11T17:00:00.000Z", "2020-07-24T01:30:00.000Z"]],
  [
    "pacific-crest-trail",
    ["2023-05-27T17:00:00.000Z", "2023-10-01T17:00:00.000Z"],
  ],
]);

export const GET: APIRoute = async ({ params }) => {
  const dates = params["id"] == null ? undefined : tracksById.get(params["id"]);

  if (dates == null) {
    return Response.json({ error: { message: "Not Found" } }, { status: 404 });
  }

  const data = await readTracks(dates[0], dates[1]);
  return Response.json({ data: { tracks: data } });
};
