// pages/_app.tsx
import { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ApolloProvider } from '@apollo/client';
import client from '@/lib/apollo-client';

import Loader from '@/components/common/loader';


function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <ApolloProvider client={client}>
      {loading && <Loader />}
      <main className="min-h-screen bg-white text-black">
        <Component {...pageProps} />
      </main>
    </ApolloProvider>
  );
}

export default MyApp;
