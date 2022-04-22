/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import 'prismjs/themes/prism-tomorrow.css'

import DefaultErrorPage from 'next/error'
import Head from 'next/head'

import { GetStaticPathsResult, GetStaticPropsResult } from 'next'
import Link from 'next/link'
import Tag from '../../components/tag'
import { Layout } from '../../components/layout'
import { allPosts, Post, Thumbnail } from 'contentlayer/generated'
import styles from './post.module.scss'

import { useMDXComponent } from 'next-contentlayer/hooks'

type Params = { id: string }
export async function getStaticProps({ params }: { params: Params }): Promise<GetStaticPropsResult<{ post?: Post }>> {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.id)
  return {
    props: {
      post
    },
  }
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const paths = allPosts.map((post) => post.url)
  return {
    paths,
    fallback: false,
  }
}

const setBaseUrl = (url: string) => `https://www.causztic.com${url}`

const getImages = (thumbnail?: Thumbnail) => {
  if (thumbnail?.url) {
    return [{
      url: setBaseUrl(thumbnail.url),
      width: thumbnail.width || 1350,
      height: thumbnail.height || 900
    }]
  }

  return [];
}

export default function PostPage({ post }: { post?: Post }): JSX.Element {
  if (!post) {
    return <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <DefaultErrorPage statusCode={404} />
    </>
  } else {
    const { title, date, formattedDate, body, tags, thumbnail } = post
    const MDXContent = useMDXComponent(body.code)
    return (
      <Layout title={title} description={""} images={getImages(thumbnail)} url={setBaseUrl(post.url)}>
        <article className="mb-4">
          <h1 className="font-bold font-sans text-slate-900 dark:text-slate-100">{title}</h1>
          <time dateTime={date} className="post-date text-sm text-slate-600 dark:text-slate-400">
            {formattedDate}
          </time>
          <hr className="my-4" />
          <section className={styles.postContent}>
            <MDXContent />
          </section>
          <section className="tags mt-6">
            {tags.map((tag: string, index: number) => <Tag key={index} text={tag}></Tag>)}
          </section>
        </article>
        <Link href="/posts">
          <a className="underline text-blue-400">Read my other posts</a>
        </Link>
      </Layout>
    )
  }
}