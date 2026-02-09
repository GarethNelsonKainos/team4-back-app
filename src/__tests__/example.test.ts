// This file is just for test purposes - to verify Vitest setup is working correctly
import { describe, it, expect } from 'vitest'

describe('Example Test Suite', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should test string operations', () => {
    const message = 'Hello Kainos!'
    expect(message).toContain('Kainos')
    expect(message.length).toBeGreaterThan(5)
  })

  it('should test async operations', async () => {
    const promise = new Promise(resolve => {
      setTimeout(() => resolve('success'), 10)
    })
    
    const result = await promise
    expect(result).toBe('success')
  })
})