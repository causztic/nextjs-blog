import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import styles from './post.module.scss'

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id)
  return {
    props: {
      postData
    }
  }
}

export async function getStaticPaths() {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false
  }
}

const components: any = {
  code({node, inline, className, children, ...props}) {
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
      <SyntaxHighlighter style={darcula} language={match[1]} PreTag="div" children={String(children).replace(/\n$/, '')} {...props} />
    ) : (
      <code className={className} {...props} />
    )
  }
}


export default function Post({ postData }) {
  return (
    <Layout>
      <article>
        <h1 className="font-bold font-sans text-gray-900">{postData.title}</h1>
        <section className="post-date text-sm text-gray-600">{postData.date}</section>
        <hr className="my-4" />
        <section className={styles.postContent}>
          <ReactMarkdown components={components}>
            {postData.content}
          </ReactMarkdown>
        </section>
      </article>
    </Layout>
  )
}