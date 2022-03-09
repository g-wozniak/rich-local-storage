import * as _ from 'lodash'
import { isTimeExceeded, base64Encode, base64Decode } from './utils'

/**
 * KeyAny
 * @description Generic interface for everything that may be in JS object
 */
interface KeyAny {
   [key: string]: any
}

/**
 * StoredItem
 * @description Defines the item you wish to store. Should include expiry timestamp and some value
 */
export type StoredItem = {
   expiry: number // expiry timestamp
   value: StoredItemValue // structure you'd like to store
}

/**
 * StoredItemValue
 * @description Value that you can possibly store
 */
export type StoredItemValue = string | number | KeyAny | string[] | number[] | null

/**
 * SlickStorageItem
 * @description Extracted cache item from the cache record
 */
export interface SlickStorageItem {
   dateOfStore: Date
   expiry: number
   type: string
   value: string
}

/**
 * store
 * @param {string} key unique key in the cache
 * @param {StoredItem} item value to be stored with expiry timestamp
 * @returns {void}
 * @description Store item in the local storage
 */
export const store = (key: string, item: StoredItem): void => {
   localStorage.setItem(key, implode(item))
}

/**
 * clear
 * @returns {void}
 * @description Clear the LocalStorage
 */
export const clear = (): void => {
   localStorage.clear()
}

/**
 * purge
 * @returns {void}
 * @description Purge the stored element
 */
export const purge = (key: string): void => {
   localStorage.removeItem(key)
}

/**
 * retrieve
 * @param {string} key key in the cache for a value to retrieve
 * @returns {StoredItemValue | null} original value cached
 * @description Retrieves a previously stored item value
 */
export const retrieve = (key: string): StoredItemValue | null => {
   const cacheRecord = localStorage.getItem(key)
   if (cacheRecord) {
      const extracted = extract(cacheRecord)
      if (extracted) {
         return explode(extracted.value, extracted.type)
      }
   }
   return null
}

/**
 * maintain
 * @returns {void}
 * @description Maintains expiry of the items stored in the storage. It throws those which expired according to the current date and time.
 */
export const maintain = (): void => {
   for (const key in localStorage) {
      const value = localStorage.getItem(key)
      if (value && value.indexOf('|') !== -1) {
         const storedItem = extract(value)
         if (storedItem && isTimeExceeded(storedItem.dateOfStore, storedItem.expiry)) {
            localStorage.removeItem(key)
         }
      }
   }
}

/**
 * implode
 * @param {StoredItem} item element to store
 * @returns {string} string to be put into the cache
 * @description Merges item to string creating cache record
 * @remarks local storage does not accept complex objects
 */
const implode = (item: StoredItem): string => {
   const dateOfStore = new Date().toISOString()

   let value = ''
   let type = 'string'
   if (_.isString(item.value)) {
      value = item.value
   } else if (_.isNumber(item.value)) {
      value = `${item.value}`
      type = 'number'
   } else if (_.isArray(item.value)) {
      value = item.value.join(',')
      type = 'array'
   } else if (_.isPlainObject(item.value)) {
      value = JSON.stringify(item.value)
      type = 'object'
   } else {
      type = 'null'
   }

   const chain = base64Encode(value)
   return `${dateOfStore}|${item.expiry}|${type}|${chain}`
}

/**
 * extract
 * @param {string} storedRecord cache record value retrieved just from the local storage that has no meaning to the app
 * @returns {SlickStorageItem} item previously converted to string
 * @description Unpacks the original value stored in the storage; it's a step before the full extraction
 */
const extract = (storedRecord: string): SlickStorageItem | null => {
   if (storedRecord.indexOf('|') === -1) {
      console.info(`SlickStorage: cannot explode ${storedRecord}. Invalid format`)
      return null
   }
   const record = storedRecord.split('|')
   return {
      dateOfStore: new Date(record[0]),
      expiry: Number(record[1]),
      type: record[2],
      value: base64Decode(record[3])
   }
}

/**
 * explode
 * @param {string} value item value retrieved just from the local storage that has no meaning to the app
 * @param {string} type type of the value used for retrieval to the original type/format
 * @returns {StoredItemValue} original item previously converted to string
 * @description Unpacks the original value stored in the cache record
 */
const explode = (value: string, type: string): StoredItemValue => {
   switch (type) {
      case 'string': {
         return value
      }
      case 'number': {
         return Number(value)
      }
      case 'array': {
         return value.split(',').map((value: string) => !isNaN(parseFloat(value)) ? Number(value) : value)
      }
      case 'object': {
         return JSON.parse(value)
      }
      default: {
         return null
      }
   }
}

