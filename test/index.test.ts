import { maintain, retrieve, store, clear, purge } from '../src'

interface Spies {
   [key: string]: jest.SpyInstance
}

describe('slick-local-storage', () => {

   const spies: Spies = {}

   beforeEach(() => {
      ['setItem', 'getItem', 'removeItem', 'clear'].forEach((fn: string) => {
         const mock = jest.fn(localStorage[fn])
         spies[fn] = jest.spyOn(localStorage.__proto__, fn).mockImplementation(mock)
      })
   })

   afterEach(() => {
      Object.keys(spies).forEach((key: string) => spies[key].mockRestore())
   })

   test('→ store a string', async () => {
      store('foo', {
         expiry: 1200,
         value: 'bar'
      })
      expect(retrieve('foo')).toEqual('bar')
      expect(spies.setItem).toHaveBeenCalledTimes(1)
      expect(spies.getItem).toHaveBeenCalledTimes(1)
   })

   test('→ store a number', async () => {
      store('age', {
         expiry: 1200,
         value: 36
      })
      expect(retrieve('age')).toEqual(36)
   })

   test('→ store an array of strings', async () => {
      const value = ['john', 'adam', 'rachel']
      store('names', {
         expiry: 1200,
         value
      })
      expect(retrieve('names')).toEqual(value)
   })

   test('→ store an array of numbers', async () => {
      const value = [0, 1, 2]
      store('counts', {
         expiry: 1200,
         value
      })
      expect(retrieve('counts')).toEqual(value)
   })

   test('→ store a non-nested object', async () => {
      const value = {
         name: 'Greg',
         surname: 'King',
         age: 21
      }

      store('king', {
         expiry: 1200,
         value
      })
      expect(retrieve('king')).toEqual(value)
   })

   test('→ store a nested object', async () => {
      const value = {
         name: 'Greg',
         surname: 'King',
         age: 21,
         parents: {
            mother: 'Anna',
            father: 'George',
            line: 4
         },
         siblings: {
            number: 2,
            names: ['john', 'ken']
         }
      }

      store('king', {
         expiry: 1200,
         value
      })
      expect(retrieve('king')).toEqual(value)
   })

   test('→ store a `null` object', async () => {
      store('wrong', {
         expiry: 1200,
         value: null
      })
      expect(retrieve('wrong')).toEqual(null)
   })

   test('→ `maintain` does not remove the property stored if within the expiry', async () => {
      store('item', { expiry: 120, value: 'test' })
      maintain()
      expect(retrieve('item')).toEqual('test')
   })

   test('→ `maintain` removes the property stored if within the expiry', async () => {
      store('item', { expiry: -30, value: 'test' })
      maintain()
      expect(retrieve('item')).toEqual(null)
   })

   test('→ `maintain` removes the multiple properties stored if within the expiry', async () => {
      store('a', { expiry: -15, value: 'a' })
      store('b', { expiry: 120, value: 'b' })
      store('c', { expiry: -30, value: 'c' })
      maintain()
      expect(retrieve('a')).toEqual(null)
      expect(retrieve('b')).toEqual('b')
      expect(retrieve('c')).toEqual(null)
   })

   test('→ `maintain` acts only on items which represent the cache framework format', async () => {
      localStorage.setItem('a', 'xxx')
      localStorage.setItem('b', 'yyy')
      store('c', { expiry: 120, value: 'c' })
      maintain()
      expect(localStorage.getItem('a')).toEqual('xxx')
      expect(retrieve('c')).toEqual('c')
   })

   test('→ multiple `maintain()` calls do not affect storage if expiry is not reached', async () => {
      store('a', { expiry: 120, value: 'a' })
      maintain()
      store('b', { expiry: 120, value: 'b' })
      maintain()
      expect(retrieve('a')).toEqual('a')
      expect(retrieve('b')).toEqual('b')
   })

   test('→ `clear` empties the full storage', async () => {
      store('a', { expiry: 120, value: 'a' })
      store('b', { expiry: 120, value: 'b' })
      clear()
      expect(retrieve('a')).toEqual(null)
      expect(retrieve('b')).toEqual(null)
   })

   test('→ purge a single item', async () => {
      store('a', { expiry: 120, value: 'a' })
      store('b', { expiry: 120, value: 'b' })
      purge('a')
      expect(retrieve('a')).toEqual(null)
      expect(retrieve('b')).toEqual('b')
   })

   test('→ retrieval attempt returns `null` if the value is not in the acceptable format', async () => {
      localStorage.setItem('dummyItem', 'somevalue')
      expect(retrieve('dummyItem')).toEqual(null)
   })
})
