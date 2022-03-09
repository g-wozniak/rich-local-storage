import moment from 'moment'
import * as crypto from 'crypto-js'

/**
 * isTimeExceeded
 * @param {date} date checked date
 * @param {number} seconds number in seconds
 * @description Checks if the date given did exceed the expectation in seconds (taking current moment in time as a base to comparison)
 * @returns {boolean} yes or no
 */
export const isTimeExceeded = (date: Date, seconds: number): boolean => {
   return moment().isAfter(moment(date).add(seconds, 'seconds'))
}

/**
 * base64Encode
 * @param {string} str string to encode
 * @description Encodes the string in base64
 * @returns {string} base64 encoded string
 */
export const base64Encode = (str: string): string => {
   const wordArray = crypto.enc.Utf8.parse(str)
   return crypto.enc.Base64.stringify(wordArray)
}

/**
 * base64Decode
 * @param {string} base64 string to decode
 * @description Decodes the base64 chain to string
 * @returns {string} string decoded
 */
export const base64Decode = (base64: string): string => {
   const parsedWordArray = crypto.enc.Base64.parse(base64)
   return parsedWordArray.toString(crypto.enc.Utf8)
}