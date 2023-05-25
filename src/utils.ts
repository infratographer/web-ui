// collection of helper functions

export function formatLocalTime(time: string) {
  return new Date(time).toLocaleString(undefined, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatLocalTimeYMD(time: string) {
  return new Date(time).toLocaleString("en-ZA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
