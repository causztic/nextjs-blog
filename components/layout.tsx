import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

const name = 'yaojie'
export const siteTitle = 'Lim Yao Jie'

export default function Layout({
  children,
  home
}: {
  children: React.ReactNode
  home?: boolean
}) {
  return (
    <div className="container w-full md:max-w-3xl mx-auto pt-20 px-2">
      <Head>
        {/* <link rel="icon" href="/favicon.ico" /> */}
        <meta name="og:title" content={siteTitle} />
        <meta name="description" content="yaojie's portfolio" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <header>
        {home ? (
          <>
            <Image
              priority
              className="rounded-full"
              src="/images/profile.jpg"
              height={144}
              width={144}
              alt={name}
            />
            <h1>{name}</h1>
          </>
        ) : (
          <>
            <Link href="/">
              <a>
                <Image
                  priority
                  className="rounded-full"
                  src="/images/profile.jpg"
                  height={108}
                  width={108}
                  alt={name}
                />
              </a>
            </Link>
            <h2>
              <Link href="/">
                <a className='font-sans'>{name}</a>
              </Link>
            </h2>
          </>
        )}
      </header>
      <main className="mt-2">{children}</main>
      {!home && (
        <div className="my-4">
          <Link href="/">
            <a className="underline text-blue-400">← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  )
}