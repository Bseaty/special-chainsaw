import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function EventDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR(id ? `/api/events/${id}` : null, fetcher);

  if (error) return <main><p>Failed to load event.</p></main>;
  if (!data) return <main><p>Loading event...</p></main>;

  return (
    <main>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <p>
        {new Date(data.startTime).toLocaleString()}<br />
        {data.venue?.name && <>at {data.venue.name}</>}
      </p>
      {/* RSVP/Ticket button will go here later */}
    </main>
  );
}