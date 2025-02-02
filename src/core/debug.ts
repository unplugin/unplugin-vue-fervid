export function createDebug(namespace: string) {
  return (...args: any[]) => {
    if (process.env.DEBUG?.includes(namespace)) {
      console.log(`\n \u001B[1m\u001B[34m[${namespace}]\u001B[0m`, ...args)
    }
  }
}
