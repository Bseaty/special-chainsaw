import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getSession({ req });
  if (!session || !session.user?.email) return res.status(401).json({ error: "Unauthorized" });

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: { role: "organizer" },
    });
    res.status(200).json({ message: "Role updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update role" });
  }
}