/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import DefaultErrorPage from 'next/error'
import Head from 'next/head'
import ReactMarkdown from 'react-markdown'

import { GetStaticPathsResult, GetStaticPropsResult } from 'next'
import Link from 'next/link'
import Tag from '../../components/tag'
import { getAllPostIds, getPostData, PostData } from '../../lib/posts'
import styles from './post.module.scss'


type Params = { id: string }
export async function getStaticProps({ params }: { params: Params }): Promise<GetStaticPropsResult<{ post: PostData | null }>> {
  const postData = await getPostData(params.id)
  return { props: { post: postData }};
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false
  }
}

export default function Post({ post }: { post: PostData | null }): JSX.Element {
  if (!post) {
    return <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <DefaultErrorPage statusCode={404} />
    </>
  } else {
    const { title, formattedDate, content, tags } = post

    return (
      <>
        <article className="mb-4">
          <h1 className="font-bold font-sans text-slate-900 dark:text-slate-100">{title}</h1>
          <section className="post-date text-sm text-slate-600 dark:text-slate-400">{formattedDate}</section>
          <hr className="my-4" />
          <section className={styles.postContent}>
            <ReactMarkdown>
              {content}
            </ReactMarkdown>
          </section>
          <section className="tags mt-6">
            {tags.map((tag: string, index: number) => <Tag key={index} text={tag}></Tag>)}
          </section>
        </article>
        <Link href="/posts">
          <a className="underline text-blue-400">Read my other posts</a>
        </Link>
      </>
    )
  }
}