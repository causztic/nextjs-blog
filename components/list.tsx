export default function List(): JSX.Element {
  const items: ListItemProps[] = [
    { url: "https://github.com/opengovsg/mockpass", name: "MockPass", description: "A mock SingPass / CorpPass / MyInfo server for dev purposes" },
    { url: "https://www.github.com/GovTechSG/myinfo-rails", name: "MyInfo API on Rails", description: "Myinfo API wrappers for Rails applications" },
    { url: "https://www.github.com/causztic/reol-chan", name: "reol-chan", description: "Discord bot to manage user administration and tweet fetching" },
    { url: "https://www.github.com/causztic/is_uen", name: "is_uen", description: "Simple gem to check whether a UEN has a valid format and date" },
  ]

  return (
    <>
      <ul className="grid md:grid-cols-3 gap-4 grid-cols-1">
        {items.map((item) => <ListItem key={item.name} {...item} />)}
      </ul>
    </>
  )
}

type ListItemProps = {
  url: string,
  name: string,
  description: string
}

function ListItem({ name, url, description }: ListItemProps): JSX.Element {
  return (
    <li className="w-full bg-white dark:bg-slate-700 box-border rounded-lg px-6 py-6 ring-1 ring-slate-900/5 shadow-xl">
      <a className="text-slate-900 dark:text-blue-300" href={url} target="_blank" rel="noreferrer noopener">
        {name}
      </a>
      <br />
      <small className="text-slate-500 dark:text-slate-300">{description}</small>
    </li>
  )
}