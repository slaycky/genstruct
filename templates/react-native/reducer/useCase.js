/* Actions - imports */
import { GET_NAMEREPLACE, GET_NAMEREPLACE_SUCCESS, GET_NAMEREPLACE_FAILURE } from '@actions/NameReplaceActions'

/* Utils - imports */
import { request } from '@utils/help'

/* Config - imports */
import ENDPOINTS from '@config/endpoints'

// const getNameReplace = (accessToken) => {
//   return async dispatch => {
//     dispatch(GET_NAMEREPLACE())
//     try {
//       const response = await request({
//         url: ENDPOINTS.GET_NAMEREPLACE,
//         headers: {
//           'Authorization': `Bearer ${accessToken}`
//         }
//       })
//       if (response.status === 200) {
//         const data = JSON.parse(response._bodyText)
//         dispatch(GET_NAMEREPLACE_SUCCESS(data))
//       } else {
//         dispatch(GET_NAMEREPLACE_FAILURE())
//       }
//     } catch (err) {
//       dispatch(GET_NAMEREPLACE_FAILURE())
//     }
//   }
// }


module.exports = {
  getNameReplace
};
