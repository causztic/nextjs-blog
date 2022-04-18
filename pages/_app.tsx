import Head from 'next/head'
import { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import '../styles/global.scss'

const url = 'https://www.causztic.com/'
const title = 'Lim Yao Jie'
const description = "Software Engineer doing Ruby on Rails, Javascript, and some DevOps"
const image = "https://www.causztic.com/images/profile.jpg"

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <DefaultSeo
        title={title}
        description={description}
        twitter={{
          handle: '@causztic',
          cardType: 'summary_large_image',
        }}
        openGraph={{
          url,
          type: 'website',
          locale: 'en_SG',
          site_name: title,
          images: [
            {
              url: image,
              width: 400,
              height: 400
            },
          ]
        }}
      />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <meta name="msapplication-TileColor" content="#60A5FA" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}