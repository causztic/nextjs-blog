import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { NextSeo } from 'next-seo'

const name = 'Lim Yao Jie'

export default function Layout({
  children,
  home,
  url,
  title = 'Lim Yao Jie',
  description,
  images,
}: {
  children: React.ReactNode
  url?: string,
  home?: boolean,
  title?: string,
  description?: string,
  images?: { url: string, width: number, height: number }[]
}): JSX.Element {
  return (
    <div className="container w-full md:max-w-3xl mx-auto pt-20 px-2">
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          url,
          images
        }}
      />
      <Head>
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
        <footer className="my-4">
          <section className="mt-3">
            <a href="https://www.github.com/causztic" target="_blank" rel="noreferrer noopener" className="mr-2">
              <Image
                src="/images/github-icon.png"
                height={64}
                width={64}
                alt='github'
              />
            </a>
            <a href="https://www.linkedin.com/in/limyaojie">
              <Image
                src="/images/linkedin-icon.png"
                height={64}
                width={64}
                alt='linkedin'
              />
            </a>
          </section>
        </footer>
      )}
    </div>
  )
}