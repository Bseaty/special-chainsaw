import useSWR from "swr";
import { useState } from "react";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ExploreEvents() {
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const query = `/api/events/public?${date ? `date=${date}&` : ""}${location ? `location=${location}` : ""}`;
  const { data, error } = useSWR(query, fetcher);

  if (error) return <main><p>Failed to load events.</p></main>;
  if (!data) return <main><p>Loading events...</p></main>;

  return (
    <main>
      <h1>Explore Events</h1>
      <form style={{marginBottom: 24}}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
      </form>
      <ul>
        {data.length === 0 && <li>No events found.</li>}
        {data.map((event: any) => (
          <li key={event.id}>
            <h2>{event.name}</h2>
            <p>
              {new Date(event.startTime).toLocaleString()}<br />
              {event.venue?.name && <>at {event.venue.name}</>}
            </p>
            <Link href={`/events/${event.id}`}>View Details</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}