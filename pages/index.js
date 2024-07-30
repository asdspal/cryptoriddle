import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>CryptoRiddle</title>
        <meta name="description" content="A blockchain word puzzle game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to CryptoRiddle</h1>
        <p>This game is played through Farcaster frames. Open this page in a Farcaster client to play!</p>
      </main>
    </div>
  )
}
