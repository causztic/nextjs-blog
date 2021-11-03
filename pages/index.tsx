import Link from 'next/link'
import Image from 'next/image'
import Tag from '../components/tag'
import Layout from '../components/layout'
import styles from './index.module.scss'

export default function Home(): JSX.Element {
  return (
    <Layout home>
      <section className="mt-1 mb-3">
        <p>Software Engineer doing Ruby on Rails, Javascript and some DevOps</p>
        <p>Currently fiddling with custom mechanical keyboards and HTML5 canvas rendering!</p>
      </section>
      <section>
        <Link href="/posts">
          <a className="text-2xl underline text-blue-400">Posts</a>
        </Link>
      </section>
      <hr className="my-4" />
      <section className={styles.projectList}>
        <h1 className="mb-2">Some of my works</h1>
        <ul>
          <li>
            <Tag text="Public Service" color="green" />
            <br />
            <a href="https://github.com/opengovsg/mockpass" target="_blank" rel="noreferrer noopener">Mockpass</a> and <a href="https://www.github.com/GovTechSG/myinfo-rails" target="_blank" rel="noreferrer noopener">MyInfo API on Rails</a>
          </li>
          <li>
            <Tag text="Music" color="yellow" />
            <br />
            <a href="https://www.bandwagon.asia" target="_blank" rel="noreferrer noopener">bandwagon.asia</a> and <a href="https://www.hear65.com" target="_blank" rel="noreferrer noopener">Hear65</a>
          </li>
          <li>
            <Tag text="Community" />
            <br />
            <a href="https://github.com/causztic/reol-chan" target="_blank" rel="noreferrer noopener">reol-chan</a>
          </li>
        </ul>
      </section>
      <section>
        <h1 className="mb-2">Find me!</h1>
        <a href="https://www.github.com/causztic" target="_blank" rel="noreferrer noopener" className="mr-2">
          <Image
            src="/images/github-icon.png"
            height={64}
            width={64}
            alt='github'
          />
        </a>
        <a href="https://www.linkedin.com/in/limyaojie">
          <Image
            src="/images/linkedin-icon.png"
            height={64}
            width={64}
            alt='linkedin'
          />
        </a>
      </section>
      <footer className="text-center mt-4">built with Next.js + tailwindcss</footer>
    </Layout>
  )
}
