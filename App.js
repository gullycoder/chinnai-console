import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './MainNavigator';
import { UserProvider } from './src/context/UserContext';
import { SupplyProvider } from './src/context/SupplyContext';





const App = () => {
  return (
    <NavigationContainer >
      <MainNavigator />
    </NavigationContainer>
  );
};

export default () => {
  return (
    <UserProvider>
      <SupplyProvider>
        <App />
      </SupplyProvider>
    </UserProvider>
  );
};