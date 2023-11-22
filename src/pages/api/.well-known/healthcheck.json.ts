import { type NextApiRequest, type NextApiResponse } from "next";

export const config = {
  runtime: "nodejs",
};

const handler = async (_req: NextApiRequest, res: NextApiResponse) =>
  res.status(200).json({ ok: true });

export default handler;
