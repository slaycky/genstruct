import React from 'react';
import { connect } from 'react-redux';

/* Componentes - presentational - Imports */
import Login from '@components/presentational/Login';

import { testRedux } from '@useCases/testUseCase';

class LoginContainer extends React.Component {
  render() {
    return (
      <Login key="login" isLoading={this.props.isLoading} list={this.props.list} testRedux={this.props.testRedux.bind(this)} />
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoading: state.test.isLoading
  };
};

const mapDispatchToProps = dispatch => ({
  testRedux: () => {
    dispatch(testRedux());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginContainer);
