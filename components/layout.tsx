import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'

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
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-6K5CMEBZJG"></Script>
      <Script>
        {
          `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-6K5CMEBZJG');
          `
        }
      </Script>
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
      <footer className="my-4">
        <section className="mt-3">
          <a href="https://www.github.com/causztic" target="_blank" rel="noreferrer noopener" className="mr-2">
            <Image
              className="dark:bg-slate-100"
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
    </div>
  )
}