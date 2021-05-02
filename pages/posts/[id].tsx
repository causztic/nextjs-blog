/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import ReactMarkdown from 'react-markdown'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import ruby from 'react-syntax-highlighter/dist/cjs/languages/prism/ruby';
import sql from 'react-syntax-highlighter/dist/cjs/languages/prism/sql';

import { GetStaticPathsResult, GetStaticPropsResult } from 'next'
import Link from 'next/link'
import Layout from '../../components/layout'
import { getAllPostIds, getPostData, PostData } from '../../lib/posts'
import styles from './post.module.scss'

SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('sql', sql);

type Params = { id: string }
export async function getStaticProps({ params }: { params: Params }): Promise<GetStaticPropsResult<PostData>> {
  const postData = await getPostData(params.id)
  return {
    props: postData
  }
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false
  }
}

const components: any = {
  code({ inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
      <SyntaxHighlighter style={darcula} language={match[1]} PreTag="div" {...props}>
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props} />
    )
  }
}


export default function Post({ title, date, content }: PostData): JSX.Element {
  return (
    <Layout title={title} description={content.split("\n")[0]}>
      <article className="mb-6">
        <h1 className="font-bold font-sans text-gray-900">{title}</h1>
        <section className="post-date text-sm text-gray-600">{date}</section>
        <hr className="my-4" />
        <section className={styles.postContent}>
          <ReactMarkdown components={components}>
            {content}
          </ReactMarkdown>
        </section>
      </article>
      <Link href="/posts">
        <a className="underline text-blue-400">Read my other posts</a>
      </Link>
    </Layout>
  )
}