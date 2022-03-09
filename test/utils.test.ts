import * as utils from '../src/utils'
import moment from 'moment'

describe('utils', () => {

   describe('→ isTimeExceeded', () => {

      test('→ returns `true` if the date exceeds the slack given', () => {
         const date = moment().subtract(30, 'seconds').toISOString()
         expect(utils.isTimeExceeded(new Date(date), 10)).toBeTruthy()
      })

      test('→ returns `false` if the date is not exceeding the slack given', () => {
         expect(utils.isTimeExceeded(new Date(), 10)).toBeFalsy()
      })
   })


   describe('→ base64Encode', () => {
      test.todo('→ example of conversion')
   })

   describe('→ base64Decode', () => {
      test.todo('→ example of conversion')
   })

})