import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getSession({ req });
  if (!session || session.user.role !== "organizer")
    return res.status(403).json({ error: "Not authorized" });

  const { name, description, startTime, endTime, venueId } = req.body;

  if (!name || !startTime || !endTime) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const event = await prisma.event.create({
      data: {
        name,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        venueId,
        organizerId: session.user.id,
      },
    });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: "Could not create event" });
  }
}