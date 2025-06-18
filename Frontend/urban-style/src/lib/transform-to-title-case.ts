export function transformToTitleCase(str: string) {
  const exceptions = ["de", "del", "la", "las", "los", "y"];
  return str
    .toLowerCase()
    .split(" ")
    .map((word, index) =>
      exceptions.includes(word) && index !== 0
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}
