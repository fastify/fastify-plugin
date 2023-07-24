export default function toCamelCase (name: string) {
  if (name[0] === '@') {
    name = name.slice(1).replace('/', '-')
  }
  const newName = name.replace(/-(.)/g, function (_, g1) {
    return g1.toUpperCase()
  })
  return newName
}
