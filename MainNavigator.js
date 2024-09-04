import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PhoneScreen from './src/screens/PhoneScreen';
import ConsoleScreen from './src/screens/ConsoleScreen';
import UsersScreen from './src/screens/UsersScreen';
import CreateUserScreen from './src/screens/CreateUserScreen';
import SplashScreen from './src/screens/SplashScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SupplyScreen from './src/screens/SupplyScreen';
import DemandScreen from './src/screens/DemandScreen';
import CreateContractorScreen from './src/screens/CreateContractorScreen';
import TechnicalProfileScreen from './src/screens/TechnicalProfileScreen';
import AdminScreen from './src/screens/AdminScreen';
import RulesScreen from './src/screens/RulesScreen';

const MainStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();


const MainNavigator = () => {

    const AuthStack = () => {
        return (
            <Stack.Navigator screenOptions={{
                // headerShown: false,
            }}>
                <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={PhoneScreen} />
            </Stack.Navigator>
        );
    };
    const ConsoleStack = () => {
        return (
            <Stack.Navigator screenOptions={{
                // headerShown: false,
            }}>
                <Stack.Screen name="Console" component={ConsoleScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="Users" component={UsersScreen} />
                <Stack.Screen name="Admin" component={AdminScreen} />
                <Stack.Screen name="Rules" component={RulesScreen} />
                <Stack.Screen
                    name="Create New User"
                    component={CreateUserScreen}
                    options={({ route }) => ({ title: route.params.title })}
                />
                <Stack.Screen name="Supply" component={SupplyScreen} />
                <Stack.Screen name="Demand" component={DemandScreen} />
                <Stack.Screen
                    name="Add New Contractor"
                    component={CreateContractorScreen}
                    options={({ route }) => ({ title: route.params.title })}
                />
                <Stack.Screen
                    name="Technical Profile"
                    component={TechnicalProfileScreen}
                    options={({ route }) => ({ title: route.params.title })}
                />
            </Stack.Navigator>
        );
    };


    return (
        <MainStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <MainStack.Screen name="AuthStack" component={AuthStack} />
            <MainStack.Screen name="ConsoleStack" component={ConsoleStack} />
        </MainStack.Navigator>
    );
}

export default MainNavigator