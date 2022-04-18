import Image from 'next/image'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import Script from 'next/script'

const name = 'Lim Yao Jie'

const Footer = () => (
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
      <a href="https://www.linkedin.com/in/limyaojie" target="_blank" rel="noreferrer noopener">
        <Image
          src="/images/linkedin-icon.png"
          height={64}
          width={64}
          alt='linkedin'
        />
      </a>
    </section>
  </footer>
)
export function Layout({
  children,
  url,
  title,
  description,
  images,
}: {
  children: React.ReactNode
  url: string,
  title: string,
  description: string,
  images: { url: string, width: number, height: number }[]
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
      <Script id="gtag">
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
      </header>
      <main className="mt-2">{children}</main>
      <Footer />
    </div>
  )
}

export function HomeLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="container w-full md:max-w-3xl mx-auto pt-20 px-2">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-6K5CMEBZJG"></Script>
      <Script id="gtag">
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
        <Image
          priority
          className="rounded-full"
          src="/images/profile.jpg"
          height={144}
          width={144}
          alt={name}
        />
        <h1>{name}</h1>
      </header>
      <main className="mt-2">{children}</main>
      <Footer />
    </div>
  )
}
