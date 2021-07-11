import { Provider } from 'next-auth/client';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import TagManager from 'react-gtm-module';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    TagManager.initialize({ gtmId: 'GTM-5K76X93' });
  }, []);
  return (
    <Provider session={pageProps.session}>
      <Component
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...pageProps}
      />
    </Provider>
  );
}
export default MyApp;
