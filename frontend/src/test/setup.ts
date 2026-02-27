import '@testing-library/jest-dom'
import { beforeAll } from 'vitest'

// Polyfill for crypto.getRandomValues
beforeAll(() => {
  if (!global.crypto) {
    global.crypto = {} as any
  }
  if (!global.crypto.getRandomValues) {
    global.crypto.getRandomValues = (array: any) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256)
      }
      return array
    }
  }
})

