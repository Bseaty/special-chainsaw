import { getSession } from "next-auth/react";
import { prisma } from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session || session.user.role !== "organizer")
    return res.status(403).json({ error: "Not authorized" });

  const events = await prisma.event.findMany({
    where: { organizerId: session.user.id },
    orderBy: { startTime: "desc" },
  });

  res.status(200).json(events);
}