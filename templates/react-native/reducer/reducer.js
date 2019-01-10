import Actions from '@actions/actions.js';

const defaultState = {
  isLoading: false,
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case Actions.GET_NAMEREPLACE:
      return { ...defaultState, isLoading: true }
    case Actions.GET_NAMEREPLACE_SUCCESS:
      return { isLoading: false }
    case Actions.GET_NAMEREPLACE_FAILURE:
      return defaultState
    default:
      return state
  }
}
