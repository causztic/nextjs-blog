import { GetStaticPropsResult } from 'next'
import Link from 'next/link'
import Layout from '../../components/layout'
import { formatDate } from '../../lib/date'
import { getSortedPostsData, PostData } from '../../lib/posts'

export async function getStaticProps(): Promise<GetStaticPropsResult<{ posts: PostData[] }>> {
  const posts = getSortedPostsData()
  return {
    props: { posts: posts }
  }
}

export default function Posts({ posts }: { posts: PostData[] }): JSX.Element {
  return <Layout>
    <ul>
      {posts.map(({ id, date, title }) => (
        <li key={id} className='mb-4'>
          <Link href={`/posts/${id}`}>
            <a>
              <h2 className="font-bold font-sans text-gray-900">{title}</h2>
              <h3 className="post-date text-gray-600">{formatDate(date)}</h3>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  </Layout>
}