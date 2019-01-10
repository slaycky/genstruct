import React from 'react';
import { SafeAreaView } from 'react-native';

/* Componentes - container - Imports */
import NameReplaceContainer from '@components/container/NameReplaceContainer';

/* Config - imports */

/* UseCases - imports */

/* Utils */
import { setStatusBar } from '@utils/help';
class NameReplaceScreen extends React.Component {
  render() {
    setStatusBar();
    return [
      <SafeAreaView key="NameReplaceSafeArea" />,
      <NameReplaceContainer key="NameReplaceContainer" navigation={this.props.navigation} />
    ];
  }
}

export default NameReplaceScreen;
