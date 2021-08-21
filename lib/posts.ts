import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { formatDate } from './date'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PostData = PostMetadata & { id: string, content: string }
export type PostTitleData = PostMetadata & { id: string }
export type PostMetadata = { title: string, date: string, published?: boolean, tags: Array<string>, thumbnail?: string, formattedDate: string }

const postsDirectory = path.join(process.cwd(), 'posts')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseHeaders(data: { [key: string]: any }): PostMetadata {
  let headers: PostMetadata = {
    title: data.title,
    published: data.published,
    tags: data.tags,
    date: data.date,
    formattedDate: formatDate(data.date),
  }

  // headers cannot be parsed if undefined, must be null
  if (data.thumbnail) {
    headers.thumbnail = data.thumbnail;
  }

  return headers;
}

export function getAllPostIds(): { params: { id: string }}[] {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

export function getSortedPostsData(): PostTitleData[] {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData: PostTitleData[] = fileNames.map(fileName => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...parseHeaders(matterResult.data)
    }
  })
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  }).filter((post) => post.published);
}

export async function getPostData(id: string): Promise<PostData | null> {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)
  const headers = parseHeaders(matterResult.data)

  if (headers.published) {
    return {
      id,
      content: matterResult.content,
      ...headers,
    }
  }

  return null
}