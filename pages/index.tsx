import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const Home: NextPage = () => (
  <>
    <Head>
      <title>Next.js and Socket.io Sandbox</title>
      <meta httpEquiv="Content-Security-Policy" content="default-src data: gap://* file://* https://ssl.gstatic.com *; img-src 'self' * data:; style-src 'self' 'unsafe-inline' *; script-src 'self' 'unsafe-eval' 'unsafe-inline' *; connect-src 'self' * ws://* wss://*;" />
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Main>
      <Link href="/othello">オセロ</Link>
    </Main>
  </>
);

export default Home;
