export type ClassProps<Class> = {
  [key in keyof Class as Class[key] extends Function ? never : key]: Class[key]
}
