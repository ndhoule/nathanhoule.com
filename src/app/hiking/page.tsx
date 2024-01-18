import { type Metadata } from "next";
import { HikingPage } from "./hiking";

export const metadata: Metadata = {
  title: "Hiking | Nathan Houle",
  robots: { follow: false },
};

const Page = () => <HikingPage />;

export default Page;
