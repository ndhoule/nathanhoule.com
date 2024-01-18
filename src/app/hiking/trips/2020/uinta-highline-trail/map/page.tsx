import { type Metadata } from "next";
import { Map } from "../../../../../../components/Map";

const config = {
  map: {
    initialViewState: {
      latitude: 40.80966221296787,
      longitude: -110.13463018180366,
      zoom: 9,
    },
    maxBounds: [
      // SW
      -111.88694957955282, 40.024470320012675,
      // NE
      -108.41801635172025, 41.57128958437155,
    ] as [number, number, number, number],
  },
  photoAlbumId: "9d2e6544-bde5-4bd4-ae0f-46ed8509c004",
  tripId: "uinta-highline-trail",
  tripStart: "2020-08-08T07:00:00.000Z",
  tripEnd: "2020-08-14T18:59:59.000Z",
};

export const metadata: Metadata = {
  title: "Uinta Highline Trail (2020) | Nathan Houle",
  robots: { follow: false, index: false },
};

const Page = () => <Map {...config} />;

export default Page;
