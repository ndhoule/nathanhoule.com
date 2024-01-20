import { type NextApiRequest, type NextApiResponse } from "next";
import { routes } from "../../../data";

export const config = {
  runtime: "nodejs",
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(400).json({ error: { message: "Malformed ID" } });
    return;
  }

  const route = routes.get(id);
  if (route == null) {
    res.status(404).json({ error: { message: "Not Found" } });
    return;
  }

  res.status(200).json({ data: route });
};

export default handler;
