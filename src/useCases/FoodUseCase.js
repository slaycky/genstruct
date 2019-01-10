/* Actions - imports */
import { GET_FOOD, GET_FOOD_SUCCESS, GET_FOOD_FAILURE } from '@actions/FoodActions'

/* Utils - imports */
import { request } from '@utils/help'

/* Config - imports */
import ENDPOINTS from '@config/endpoints'

// const getFood = (accessToken) => {
//   return async dispatch => {
//     dispatch(GET_FOOD())
//     try {
//       const response = await request({
//         url: ENDPOINTS.GET_FOOD,
//         headers: {
//           'Authorization': `Bearer ${accessToken}`
//         }
//       })
//       if (response.status === 200) {
//         const data = JSON.parse(response._bodyText)
//         dispatch(GET_FOOD_SUCCESS(data))
//       } else {
//         dispatch(GET_FOOD_FAILURE())
//       }
//     } catch (err) {
//       dispatch(GET_FOOD_FAILURE())
//     }
//   }
// }


module.exports = {
  getFood
};
