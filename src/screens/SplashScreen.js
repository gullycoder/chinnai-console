import React, { useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, StatusBar, StyleSheet, Text, TextInput, View, SafeAreaView, Image } from 'react-native';
import { colors, opacities, spacings, textStyles, ButtonOne, ButtonTwo, SelectStory, DividerVertical, DividerHorizontal } from '../context/DesignSystem';
import { UserContext } from '../context/UserContext';



const SplashScreen = ({ navigation }) => {
    const { fetchUsers, setCurrentUser } = useContext(UserContext);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchUsers()
        })
        return unsubscribe
    }, [navigation])

    useEffect(() => {
        AsyncStorage.getItem('userToken').then(token => {
            if (token) {
                const currentUser = JSON.parse(token);
                if (currentUser.phone && currentUser.pin) {
                    navigation.reset({
                        index: 0,
                        routes: [{
                            name: 'ConsoleStack',
                            params: { screen: 'Console' }
                        }]
                    })
                    setCurrentUser(currentUser)

                }
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }]
                });
            }
        });

    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.primaryDark} />
            <View style={styles.greenView}>
                {/* <Image source={require('./logo-light.png')} style={styles.imageStyle} /> */}
            </View>
            <View style={styles.innerContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    greenView: {
        height: 100,
        backgroundColor: colors.primary,
    },
    imageStyle: {
        width: 100,
        height: 80,
        borderRadius: 8,
        borderColor: 'white',
        borderWidth: 2,
        zIndex: 1,
        position: 'absolute',
        top: 60,
        alignSelf: 'center',
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'space-evenly',
        padding: spacings.large,
    },

})

export default SplashScreen;