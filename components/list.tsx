export default function List(): JSX.Element {
  const items: ListItemProps[] = [
    { url: "https://github.com/opengovsg/mockpass", name: "MockPass", description: "A mock SingPass / CorpPass / MyInfo server for dev purposes" },
    { url: "https://www.github.com/GovTechSG/myinfo-rails", name: "MyInfo API on Rails", description: "Myinfo API wrappers for Rails applications" },
    { url: "https://www.github.com/causztic/reol-chan", name: "reol-chan", description: "Discord bot to manage user administration and tweet fetching" },
    { url: "https://www.github.com/causztic/is_uen", name: "is_uen", description: "Simple gem to check whether a UEN has a valid format and date" },
  ]

  return (
    <>
      <ul className="flex flex-row flex-wrap">
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
    <li className="w-full box-border my-2 pr-2 w-full md:w-1/3">
      <a className="text-blue-400" href={url} target="_blank" rel="noreferrer noopener">
        {name}
      </a>
      <br />
      <small>{description}</small>
    </li>
  )
}
