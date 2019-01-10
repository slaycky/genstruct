import actions from './actions';

const GET_NAMEREPLACE = () => {
  return {
    type: actions.GET_NAMEREPLACE
  };
}

const GET_NAMEREPLACE_SUCCESS = data => {
  // const { food } = data;
  return {
    type: actions.GET_NAMEREPLACE_SUCCESS,
    // food
  };
}

const GET_NAMEREPLACE_FAILURE = error => {
  return {
    type: actions.GET_NAMEREPLACE_FAILURE,
    error
  };
}

module.exports = {
  GET_NAMEREPLACE,
  GET_NAMEREPLACE_SUCCESS,
  GET_NAMEREPLACE_FAILURE
};
