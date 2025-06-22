import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== "string") return res.status(400).json({ error: "Invalid" });

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { venue: true },
    });
    if (!event) return res.status(404).json({ error: "Not found" });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
}