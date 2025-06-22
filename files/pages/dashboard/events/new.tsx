import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function NewEvent() {
  const { data: session } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    venueId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/events/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const event = await res.json();
      router.push(`/dashboard/events/${event.id}`);
    } else {
      const err = await res.json();
      setError(err.error || "Error creating event");
      setLoading(false);
    }
  };

  if (!session || session.user.role !== "organizer") {
    return <p>Not authorized.</p>;
  }

  return (
    <main>
      <h1>Create New Event</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Event Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="startTime"
          type="datetime-local"
          value={form.startTime}
          onChange={handleChange}
          required
        />
        <input
          name="endTime"
          type="datetime-local"
          value={form.endTime}
          onChange={handleChange}
          required
        />
        {/* If you have venues, you can add a select here */}
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </main>
  );
}