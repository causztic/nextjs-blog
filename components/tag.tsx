declare type Color = 'slate' | 'green' | 'yellow'
declare type TagProps = { text: string, color?: Color }

export default function Tag({ text, color = 'slate' }: TagProps): JSX.Element {
  // TODO: refactor to prevent tag color from being purged
  // see: https://tailwindcss.com/docs/optimizing-for-production
  return <div className={`inline-block mr-1 bg-${color}-200 p-1 rounded dark:text-slate-800`}>{text}</div>
}
