import { kml as kmlToGeoJSON } from "@tmcw/togeojson";
import { DOMParser } from "@xmldom/xmldom";
import * as d from "date-fns";
import { config } from "../../../../../server/config";
import { createGarminClient } from "../../../../../server/garmin";

export const runtime = "edge";

const garminClient = createGarminClient({
  auth: { password: config.garmin.mapSharePassword },
  mapId: config.garmin.mapShareMapId,
});

export const GET = async (_req: Request): Promise<Response> => {
  const response = await garminClient.getMapKml();
  const xml = await response.text();
  const parsedXml = new DOMParser().parseFromString(xml, "text/xml");
  const data = kmlToGeoJSON(parsedXml);

  const currentLocation = {
    ...data,
    features: data.features
      .filter(({ geometry, properties }) => {
        if (geometry == null || properties == null) {
          return false;
        }

        if (properties["IMEI"] !== "301434031023530") {
          return false;
        }

        if (typeof properties["timestamp"] !== "string") {
          return false;
        }

        const parsed = Date.parse(properties["timestamp"]);
        if (Number.isNaN(parsed)) {
          return false;
        }
        const timestamp = new Date(parsed);
        // If older than two weeks, omit
        if (d.isBefore(timestamp, d.subDays(new Date(), 14))) {
          return false;
        }

        return true;
      })
      .map(({ properties, ...rest }) => ({
        // properties: {
        //   Course: "337.50 ° True"
        //   "Device Identifier": ""
        //   "Device Type": "inReach Mini 2"
        //   Elevation: "214.66 m from MSL"
        //   Event: "Tracking turned off from device."
        //   IMEI: "301434031023530"
        //   Id: "616528761"
        //   "In Emergency": "False"
        //   "Incident Id": ""
        //   Latitude: "37.753175"
        //   Longitude: "-122.449043"
        //   "Map Display Name": "Nathan Houle"
        //   Name: "Nathan Houle"
        //   SpatialRefSystem: "WGS84"
        //   Text: ""
        //   Time: "5/11/2023 12:41:30 PM"
        //   "Time UTC": "5/11/2023 7:41:30 PM"
        //   "Valid GPS Fix": "True"
        //   Velocity: "1.0 km/h"
        //   icon: "http://maps.google.com/mapfiles/kml/paddle/wht-blank.png"
        //   "icon-color": "#0055ff"
        //   "icon-opacity": 1
        //   name: "Nathan Houle"
        //   styleUrl: "#style_3131267"
        //   timestamp: "2023-05-11T19:41:30Z"
        //   visibility: true
        // }
        properties:
          properties == null
            ? {}
            : {
                latitude:
                  typeof properties["Latitude"] === "string"
                    ? Number.parseFloat(properties["Latitude"])
                    : null,
                longitude:
                  typeof properties["Longitude"] === "string"
                    ? Number.parseFloat(properties["Longitude"])
                    : null,
                timestamp:
                  typeof properties["timestamp"] === "string"
                    ? properties["timestamp"]
                    : null,
              },
        ...rest,
      })),
  };

  return Response.json({ data: currentLocation });
};
