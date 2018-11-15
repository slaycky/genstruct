import React from 'react';
import { connect } from 'react-redux';

/* Componentes - presentational - Imports */
import NameReplace from '@components/presentational/NameReplace';

import { testRedux } from '@useCases/testUseCase';

class NameReplaceContainer extends React.Component {
  render() {
    return (
      <NameReplace key="namereplace" isLoading={this.props.isLoading} list={this.props.list} testRedux={this.props.testRedux.bind(this)} />
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
)(NameReplaceContainer);
