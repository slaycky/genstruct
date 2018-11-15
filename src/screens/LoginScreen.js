import React from 'react';
import { SafeAreaView } from 'react-native';

/* Componentes - container - Imports */
import LoginContainer from '@components/container/LoginContainer';

/* Config - imports */

/* UseCases - imports */

/* Utils */
import { setStatusBar } from '@utils/help';
class LoginScreen extends React.Component {
  render() {
    setStatusBar();
    return [
      <SafeAreaView key="LoginSafeArea" />,
      <LoginContainer key="LoginContainer" navigation={this.props.navigation} />
    ];
  }
}

export default LoginScreen;
