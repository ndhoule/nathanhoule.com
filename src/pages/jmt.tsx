import "leaflet/dist/leaflet.css";

import dynamic from "next/dynamic";

const Map = dynamic(async () => import("../components/JmtMap"), { ssr: false });

const JmtPage = () => <Map />;

export default JmtPage;
