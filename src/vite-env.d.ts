/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

declare module '*.png' {
  const value: string
  export default value
}
