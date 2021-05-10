import { GetStaticPropsResult } from 'next'
import Link from 'next/link'
import Layout from '../../components/layout'
import { getSortedPostsData, PostTitleData } from '../../lib/posts'

export async function getStaticProps(): Promise<GetStaticPropsResult<{ posts: PostTitleData[] }>> {
  const posts = getSortedPostsData()
  return {
    props: { posts: posts }
  }
}

export default function Posts({ posts }: { posts: PostTitleData[] }): JSX.Element {
  return <Layout>
    <ul>
      {posts.map(({ id, formattedDate, title }) => (
        <li key={id} className='mb-4'>
          <Link href={`/posts/${id}`}>
            <a>
              <h2 className="font-bold font-sans text-gray-900">{title}</h2>
              <h3 className="post-date text-gray-600">{formattedDate}</h3>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  </Layout>
}