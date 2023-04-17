import { type Metadata } from "next";
import { Map } from "../../../../components/Map";

const config = {
  map: {
    initialViewState: {
      latitude: 37.225265,
      longitude: -118.895305,
      zoom: 9,
    },
    maxBounds: [
      // SW
      -136.09690763237217, 22.029278549400683,
      // NE
      -98.05219538673303, 54.04133322042521,
    ] as [number, number, number, number],
  },
  photoAlbumId: "98c6d823-0f56-498f-9ca3-7a31b81c10e6",
  tripId: "john-muir-trail",
  tripStart: "2020-07-11T17:00:00.000Z",
  tripEnd: "2020-07-24T01:30:00.000Z",
};

export const metadata: Metadata = {
  title: "John Muir Trail (2020) | Nathan Houle",
};

const Page = () => <Map {...config} />;

export default Page;
