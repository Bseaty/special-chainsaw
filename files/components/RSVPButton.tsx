import { useSession, signIn } from "next-auth/react";
import { useState } from "react";

export default function RSVPButton({ eventId }: { eventId: string }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [rsvped, setRsvped] = useState(false);
  const [error, setError] = useState("");

  const handleRSVP = async () => {
    if (!session) {
      signIn();
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/events/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId }),
    });
    const data = await res.json();
    if (res.ok) {
      setRsvped(true);
    } else {
      setError(data.error || "Error submitting RSVP");
    }
    setLoading(false);
  };

  if (!session) {
    return <button onClick={() => signIn()}>Sign in to RSVP</button>;
  }
  if (rsvped) return <button disabled>RSVP’d!</button>;

  return (
    <>
      <button onClick={handleRSVP} disabled={loading}>
        {loading ? "RSVP’ing..." : "RSVP"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}