import actions from './actions';

const GET_FOOD = () => {
  return {
    type: actions.GET_FOOD
  };
}

const GET_FOOD_SUCCESS = data => {
  // const { food } = data;
  return {
    type: actions.GET_FOOD_SUCCESS,
    // food
  };
}

const GET_FOOD_FAILURE = error => {
  return {
    type: actions.GET_FOOD_FAILURE,
    error
  };
}

module.exports = {
  GET_FOOD,
  GET_FOOD_SUCCESS,
  GET_FOOD_FAILURE
};
