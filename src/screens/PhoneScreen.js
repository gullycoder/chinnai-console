import { StyleSheet, Text, View, Button, TextInput } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, opacities, spacings, textStyles, textInputStyles, ButtonOne, ButtonTwo, SelectStory, DividerVertical, DividerHorizontal, ButtonTwoUnfilled, iconSizes, ButtonOneUnfilled } from '../context/DesignSystem';
import { UserContext } from '../context/UserContext'

const PhoneScreen = ({ navigation }) => {
    const { users, setCurrentUser } = React.useContext(UserContext)
    const [phone, setPhone] = React.useState('')
    const [pin, setPin] = React.useState('')


    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>
                Chinaai Console
            </Text>
            <Text style={styles.label} >
                Mobile number (10 digit)
            </Text>
            <TextInput
                style={styles.textInput}
                keyboardType="number-pad"
                maxLength={10}
                placeholder="Enter your mobile number"
                onChangeText={(text) => {
                    setPhone(text)
                }}
            />
            <Text style={styles.label} >
                PIN (4 digit)
            </Text>
            <TextInput
                style={styles.textInput}
                keyboardType="number-pad"
                maxLength={4}
                placeholder="Enter your PIN"
                onChangeText={(text) => {
                    setPin(text)
                }}
                secureTextEntry={true}
            />

            <ButtonOne
                title="Login"
                style={{ marginTop: spacings.large }}
                onPress={async () => {
                    const user = users.find(user => user.phone === phone && user.pin === pin)
                    if (user) {
                        await AsyncStorage.setItem('userToken', JSON.stringify(user))
                        navigation.reset({
                            index: 0,
                            routes: [{
                                name: 'ConsoleStack',
                                params: { screen: 'Console' }
                            }]
                        })
                        setCurrentUser(user)
                    } else {
                        alert('Invalid phone number or PIN')
                    }
                }}

            />
        </View>
    )
}

export default PhoneScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 60,
    },
    welcome: {
        ...textStyles.heading1,
        fontSize: textStyles.heading1.fontSize * 1.25,
        fontWeight: 'bold',
        textAlign: "center",
        marginBottom: spacings.medium * 4,
    },
    label: {
        ...textStyles.body,
        fontWeight: 'bold',
    },
    textInput: {
        ...textInputStyles.large,
        backgroundColor: colors.surface,
        marginTop: spacings.medium,
        marginBottom: spacings.large,
        marginHorizontal: spacings.medium,
    },

})