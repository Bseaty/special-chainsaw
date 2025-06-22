import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/explore">Explore Events</Link>
      <Link href="/dashboard">Host Dashboard</Link>
    </nav>
  );
}