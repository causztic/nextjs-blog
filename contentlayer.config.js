import { defineDocumentType, defineNestedType, makeSource } from 'contentlayer/source-files'
import rehypePrism from 'rehype-prism-plus'
import { format, parseISO } from 'date-fns'

const Thumbnail = defineNestedType(() => ({
  name: 'Thumbnail',
  fields: {
    url: {
      type: 'string',
    },
    height: {
      type: 'number',
    },
    width: {
      type: 'number',
    },
  },
}))

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    published: {
      type: 'boolean',
      required: true,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      required: true,
    },
    date: {
      type: 'date',
      required: true,
    },
    thumbnail: {
      type: 'nested',
      of: Thumbnail,
    },
    summary: {
      type: 'string',
      required: true
    }
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/posts/${post._raw.flattenedPath}`,
    },
    formattedDate: {
      type: 'string',
      resolve: (post) => format(parseISO(post.date), 'LLLL d, yyyy')
    }
  },
}))

export default makeSource({
  contentDirPath: 'posts',
  documentTypes: [Post],
  mdx: { rehypePlugins: [rehypePrism] },
})