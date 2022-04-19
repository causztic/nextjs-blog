import Link from 'next/link'
import List from '../components/list'

export default function Home(): JSX.Element {
  return (
    <>
      <section className="mt-1 mb-3">
        <p>Software Engineer doing Ruby on Rails, Javascript and some DevOps</p>
        <small>Currently fiddling with custom mechanical keyboards and reading books on system design</small>
      </section>
      <section>
        <Link href="/posts">
          <a className="font-bold text-2xl text-blue-400">Posts</a>
        </Link>
      </section>
      <hr className="my-4" />
      <section>
        <h2 className="mb-2">Some open source contributions</h2>
        <List />
      </section>
    </>
  )
}
