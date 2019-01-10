import Actions from '@actions/actions.js';

const defaultState = {
  isLoading: false,
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case Actions.GET_FOOD:
      return { ...defaultState, isLoading: true }
    case Actions.GET_FOOD_SUCCESS:
      return { isLoading: false }
    case Actions.GET_FOOD_FAILURE:
      return defaultState
    default:
      return state
  }
}
