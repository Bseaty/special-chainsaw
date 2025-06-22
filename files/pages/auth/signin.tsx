import { getProviders, signIn } from "next-auth/react";

export default function SignIn({ providers }: any) {
  return (
    <div>
      <h1>Sign in to Vente</h1>
      {Object.values(providers).map((provider: any) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

SignIn.getInitialProps = async () => {
  const providers = await getProviders();
  return { providers };
};