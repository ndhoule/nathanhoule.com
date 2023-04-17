import { type Metadata } from "next";
import { Map } from "../../../../components/Map";

const config = {
  map: {
    initialViewState: {
      bounds: [
        // SW
        -114.30130129473933, 32.65571245296696,
        // NE
        124.88258554454468, 49.00398836485662,
      ] as [number, number, number, number],
    },
    maxBounds: [
      // SW
      -136.09690763237217, 22.029278549400683,
      // NE
      -98.05219538673303, 54.04133322042521,
    ] as [number, number, number, number],
  },
  photoAlbumId: "3fc46ea9-cf1e-4933-b160-d5e957b60d9c",
  tripEnd: "2023-10-01T17:00:00.000Z",
  tripId: "pacific-crest-trail",
  tripStart: "2023-05-27T17:00:00.000Z",
};

export const metadata: Metadata = {
  title: "Pacific Crest Trail (2023) | Nathan Houle",
};

const Page = () => <Map {...config} />;

export default Page;
