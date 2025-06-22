import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function UpgradeButton() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [upgraded, setUpgraded] = useState(false);

  if (status === "loading") return null;
  if (!session) return <button onClick={() => signIn()}>Sign in</button>;
  if (session.user.role === "organizer") return <p>You are already an organizer.</p>;

  const upgrade = async () => {
    setLoading(true);
    const res = await fetch("/api/user/upgrade", { method: "POST" });
    if (res.ok) {
      setUpgraded(true);
      // NextAuth's session won't update the new role until you sign out/in or reload the session
      setTimeout(() => signOut({ callbackUrl: "/auth/signin" }), 2000);
    }
    setLoading(false);
  };

  return (
    <div>
      {upgraded ? (
        <p>
          Upgraded! You’ll be logged out—please sign back in to access organizer features.
        </p>
      ) : (
        <button onClick={upgrade} disabled={loading}>
          {loading ? "Upgrading..." : "Upgrade to Organizer"}
        </button>
      )}
    </div>
  );
}