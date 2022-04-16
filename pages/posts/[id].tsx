/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import DefaultErrorPage from 'next/error'
import Head from 'next/head'
import rehypeRaw from 'rehype-raw'
import ReactMarkdown from 'react-markdown'

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import ruby from 'react-syntax-highlighter/dist/cjs/languages/prism/ruby'
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript'
import sql from 'react-syntax-highlighter/dist/cjs/languages/prism/sql'
import { GetStaticPathsResult, GetStaticPropsResult } from 'next'
import Link from 'next/link'
import Tag from '../../components/tag'
import Layout from '../../components/layout'
import { getAllPostIds, getPostData, PostData } from '../../lib/posts'
import styles from './post.module.scss'

SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('javascript', javascript);

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

const components: any = {
  a({ href, children }) {
    if (!href.startsWith('http')) {
      return <></>
    }

    return <a href={href} rel='nofollow noreferrer noopener' target='_blank'>{children}</a>
  },
  code({ inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
      <SyntaxHighlighter style={darcula} language={match[1]} PreTag="div" {...props}>
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={styles.basic}>{children}</code>
    )
  }
}

const setBaseUrl = (url?: string) => {
  if (url) {
    return `https://www.causztic.com${url}`
  }

  return undefined;
}

const getImages = (thumbnail?: [string, number, number]) => {
  if (thumbnail) {
    return [{
      url: setBaseUrl(thumbnail[0])!,
      width: thumbnail[1],
      height: thumbnail[2]
    }]
  }

  return undefined;
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
    const { title, formattedDate, content, tags, thumbnail } = post

    return (
      <Layout title={title} description={content.split("\n")[0]} images={getImages(thumbnail)} url={setBaseUrl(`/posts/${post.id}`)}>
        <article className="mb-4">
          <h1 className="font-bold font-sans text-gray-900 dark:text-gray-100">{title}</h1>
          <section className="post-date text-sm text-gray-600 dark:text-gray-400">{formattedDate}</section>
          <hr className="my-4" />
          <section className={styles.postContent}>
            <ReactMarkdown rehypePlugins={[rehypeRaw]} components={components}>
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
      </Layout>
    )
  }
}