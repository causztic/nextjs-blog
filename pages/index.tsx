import Link from 'next/link'
import { HomeLayout } from '../components/layout'
import List from '../components/list'

export default function Home(): JSX.Element {
  return (
    <HomeLayout>
      <section className="mt-1 mb-3 dark:text-slate-300">
        <p>Software Engineer doing <b>Ruby on Rails</b>, <b>Javascript</b> and some <b>DevOps</b></p>
        <small>Currently fiddling with custom mechanical keyboards and reading books on system design</small>
      </section>
      <section>
        <Link href="/posts">
          <a className="font-bold text-2xl text-blue-400">Posts</a>
        </Link>
      </section>
      <br />
      <List />
    </HomeLayout>
  )
}
