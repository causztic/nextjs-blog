import { GetStaticPropsResult } from 'next'
import Link from 'next/link'
import { HomeLayout } from '../../components/layout'
import { compareDesc } from 'date-fns'
import { allPosts, Post } from 'contentlayer/generated'

export async function getStaticProps(): Promise<GetStaticPropsResult<{ posts: Post[] }>> {
  const posts = allPosts.sort((a, b) => {
    return compareDesc(new Date(a.date), new Date(b.date))
  })
  return { props: { posts } }
}

export default function Posts({ posts }: { posts: Post[] }): JSX.Element {
  return <HomeLayout>
    <ul>
      {posts.map(({ title, url, formattedDate }, index) => (
        <li key={index} className='mb-4'>
          <Link href={url}>
            <a>
              <h2 className="font-bold font-sans text-slate-900 dark:text-slate-100">{title}</h2>
              <small className="text-slate-600 dark:text-slate-400">{formattedDate}</small>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  </HomeLayout>
}