import React from 'react';
import { SafeAreaView } from 'react-native';

/* Componentes - container - Imports */
import HelloContainer from '@components/container/HelloContainer';

/* Config - imports */

/* UseCases - imports */

/* Utils */
import { setStatusBar } from '@utils/help';
class HelloScreen extends React.Component {
  render() {
    setStatusBar();
    return [
      <SafeAreaView key="HelloSafeArea" />,
      <HelloContainer key="HelloContainer" navigation={this.props.navigation} />
    ];
  }
}

export default HelloScreen;
