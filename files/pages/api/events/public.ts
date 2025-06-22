import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { date, location } = req.query;
  let where: any = { status: "published" };
  if (date) {
    // Find events starting on the selected date
    const start = new Date(date as string);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);
    where.startTime = { gte: start, lt: end };
  }
  if (location) {
    where.venue = { name: { contains: location as string, mode: "insensitive" } };
  }

  try {
    const events = await prisma.event.findMany({
      where,
      orderBy: { startTime: "asc" },
      include: { venue: true },
    });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
}