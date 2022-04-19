import { GetStaticPropsResult } from 'next'
import Link from 'next/link'
import { getSortedPostsData, PostTitleData } from '../../lib/posts'

export async function getStaticProps(): Promise<GetStaticPropsResult<{ posts: PostTitleData[] }>> {
  const posts = getSortedPostsData()
  return {
    props: { posts: posts }
  }
}

export default function Posts({ posts }: { posts: PostTitleData[] }): JSX.Element {
  return <>
    <ul>
      {posts.map(({ id, formattedDate, title }) => (
        <li key={id} className='mb-4'>
          <Link href={`/posts/${id}`}>
            <a>
              <h2 className="font-bold font-sans text-slate-900 dark:text-slate-100">{title}</h2>
              <small className="text-slate-600 dark:text-slate-400">{formattedDate}</small>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  </>
}