import { GetStaticPropsResult, GetServerSideProps } from 'next'
import { compareDesc } from 'date-fns'
import { allPosts } from 'contentlayer/generated'
import RSS from 'rss'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  if (res) {
    const posts = allPosts.sort((a, b) => {
      return compareDesc(new Date(a.date), new Date(b.date))
    })

    const feed = new RSS({
      title: 'test',
      feed_url: 'localhost',
      site_url: 'localhost'
    })

    posts.forEach(post => {
      feed.item(
        {
          title: post.title,
          description: post.body.html,
          url: post.url,
          guid: post._id,
          categories: post.tags,
          date: post.formattedDate
        }
      )
    })

    res.setHeader('Content-Type', 'text/xml')
    res.write(feed.xml({ indent: true }))
    res.end()
  }
  return {
    props: {},
  }
}

// export async function getStaticProps(): Promise<GetStaticPropsResult<{ feed: string }>> {
//   const posts = allPosts.sort((a, b) => {
//     return compareDesc(new Date(a.date), new Date(b.date))
//   })

//   const feed = new RSS({
//     title: 'test',
//     feed_url: 'localhost',
//     site_url: 'localhost'
//   })

//   posts.forEach(post => {
//     feed.item(
//       {
//         title: post.title,
//         description: post.body.html,
//         url: post.url,
//         guid: post._id,
//         categories: post.tags,
//         date: post.formattedDate
//       }
//     )
//   })

//   return { props: { feed: feed.xml({ indent: true }) } };
// }

export default (): null => null