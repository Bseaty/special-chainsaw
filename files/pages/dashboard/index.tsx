import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";

export default function Dashboard() {
  return (
    <main>
      <h1>Host Dashboard</h1>
      {/* Organizer UI */}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session || session.user.role !== "organizer") {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }
  return { props: {} };
};