import React from 'react';
import { connect } from 'react-redux';

/* Componentes - presentational - Imports */
import Hello from '@components/presentational/Hello';

import { testRedux } from '@useCases/testUseCase';

class HelloContainer extends React.Component {
  render() {
    return (
      <Hello key="hello" isLoading={this.props.isLoading} list={this.props.list} testRedux={this.props.testRedux.bind(this)} />
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
)(HelloContainer);
