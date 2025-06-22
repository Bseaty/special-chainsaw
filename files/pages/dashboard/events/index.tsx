import useSWR from "swr";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function EventsDashboard() {
  const { data, error } = useSWR("/api/events/mine", fetcher);

  if (!data) return <p>Loading...</p>;
  if (error) return <p>Error loading events.</p>;

  return (
    <main>
      <h1>My Events</h1>
      <Link href="/dashboard/events/new">+ Create New Event</Link>
      <ul>
        {data.map((event: any) => (
          <li key={event.id}>
            <Link href={`/dashboard/events/${event.id}`}>{event.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}