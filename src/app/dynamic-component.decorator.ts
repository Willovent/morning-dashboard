export const dynamicComponents: { [key: string]: any } = {};

export function dynamic<T extends { new(...args: any[]): {} }>(name: string) {
  return function (constructor: T) {
    dynamicComponents[name] = constructor
  }
}
