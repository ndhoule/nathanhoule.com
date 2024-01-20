import { type NextApiRequest, type NextApiResponse } from "next";
import { routes } from "../../../data";

export const config = {
  runtime: "nodejs",
};

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ data: routes.values() });
};

export default handler;
