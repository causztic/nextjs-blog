declare type Color = 'pink' | 'purple' | 'indigo' | 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'black'

export default function Tag({ text, color = 'gray' }: { text: string, color?: Color }): JSX.Element {
  return <div className={`inline-block mr-1 bg-${color}-200 p-1 rounded`}>{text}</div>
}