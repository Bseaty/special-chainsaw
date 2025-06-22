import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getSession({ req });
  if (!session || !session.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { eventId } = req.body;
  if (!eventId) return res.status(400).json({ error: "Missing eventId" });

  try {
    const rsvp = await prisma.guestlist.create({
      data: {
        eventId,
        userId: session.user.id,
      },
    });
    res.status(200).json({ success: true, rsvp });
  } catch (err: any) {
    if (err.code === 'P2002') { // Unique constraint failed (already RSVP’d)
      return res.status(400).json({ error: "You have already RSVP'd for this event." });
    }
    res.status(500).json({ error: "Could not RSVP for event." });
  }
}