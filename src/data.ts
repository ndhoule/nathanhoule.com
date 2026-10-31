import jmtRoute from "../data/routes/jmt_full.json?simplified";
import pctRoute from "../data/routes/pct_full.json?simplified";
import uhtRoute from "../data/routes/uinta_highline_trail.json?simplified";

export const routes = new Map([
  [
    "pacific-crest-trail",
    {
      id: "pacific-crest-trail",
      label: "Pacific Crest Trail",
      data: pctRoute,
    },
  ],
  [
    "john-muir-trail",
    {
      id: "john-muir-trail",
      label: "John Muir Trail",
      data: jmtRoute,
    },
  ],
  [
    "uinta-highline-trail",
    {
      id: "uinta-highline-trail",
      label: "Uinta Highline Trail",
      data: uhtRoute,
    },
  ],
]);
