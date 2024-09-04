import { StyleSheet, Text, TextInput, TouchableOpacity, View, StatusBar, Button } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, opacities, spacings, textStyles, textInputStyles, ButtonOne, ButtonTwo, SelectStory, DividerVertical, DividerHorizontal, ButtonTwoUnfilled, iconSizes, ButtonOneUnfilled } from '../context/DesignSystem';
import { UserContext } from '../context/UserContext';


const SettingsScreen = ({ navigation }) => {
    const { users, currentUser, resetCurrentUser, updateCurrentUserPin } = useContext(UserContext)
    const [editPin, setEditPin] = React.useState(false)
    const [currentPin, setCurrentPin] = React.useState('')
    const [newPin, setNewPin] = React.useState('')
    const [confirmPin, setConfirmPin] = React.useState('')

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            resetCurrentUser()
        })
        return unsubscribe
    }, [navigation, users])


    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={colors.primaryDark} />
            <TouchableOpacity
                style={styles.sectionContainer}
                onPress={async () => {
                    try {
                        await AsyncStorage.removeItem('userToken');
                        navigation.reset({
                            index: 0,
                            routes: [{
                                name: 'AuthStack',
                                params: { screen: 'Login' }
                            }],
                        });
                    }
                    catch (e) {
                        console.log(e);
                    }
                }}
            >
                <MaterialIcons name="logout" size={iconSizes.large} color={colors.icon} />
                <Text style={styles.sectionHeading}>
                    Sign Out
                </Text>
            </TouchableOpacity>
            {currentUser.userType === 'Admin' &&
                <TouchableOpacity
                    style={styles.sectionContainer}
                    onPress={() => {
                        navigation.navigate('Create New User', { userToEdit: currentUser, title: 'Edit User' })
                    }}
                >
                    <MaterialIcons name="person-outline" size={iconSizes.large} color={colors.icon} />
                    <Text style={styles.sectionHeading}>
                        Edit Profile
                    </Text>
                </TouchableOpacity>}
            {currentUser.userType !== 'Admin' && !editPin &&
                <TouchableOpacity
                    style={styles.sectionContainer}
                    onPress={() => {
                        setEditPin(true)
                    }}
                >
                    <MaterialIcons name="lock-outline" size={iconSizes.large} color={colors.icon} />
                    <Text style={styles.sectionHeading}>
                        Change PIN
                    </Text>
                </TouchableOpacity>}
            {currentUser.userType !== 'Admin' && editPin &&
                <View style={styles.editPinContainer}>
                    <Text style={[styles.label, { marginTop: spacings.large }]}>
                        Enter your current PIN (4 digit)*
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Current PIN"
                        keyboardType="number-pad"
                        autoFocus={true}
                        value={currentPin}
                        secureTextEntry={true}
                        onChangeText={(text) => {
                            setCurrentPin(text)
                        }}
                    />
                    <Text style={styles.label}>
                        Enter your new PIN (4 digit)*
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="New PIN"
                        keyboardType="number-pad"
                        value={newPin}
                        secureTextEntry={true}
                        onChangeText={(text) => {
                            setNewPin(text)
                        }}
                    />
                    <Text style={styles.label}>
                        Confirm your new PIN (4 digit)*
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Confirm PIN"
                        keyboardType="number-pad"
                        value={confirmPin}
                        secureTextEntry={true}
                        onChangeText={(text) => {
                            setConfirmPin(text)
                        }}
                    />
                    <ButtonOne
                        title="Change PIN"
                        style={{ marginTop: spacings.medium, marginBottom: spacings.medium }}
                        disabled={currentPin.length !== 4 || newPin.length !== 4 || confirmPin.length !== 4}
                        onPress={async () => {
                            if (newPin === confirmPin) {
                                try {
                                    const result = await updateCurrentUserPin(currentPin, newPin)
                                    if (result.error) {
                                        alert(result.error)
                                    } else {
                                        setEditPin(false)
                                        alert('PIN updated successfully')
                                    }
                                }
                                catch (e) {
                                    console.log(e);
                                }
                            } else {
                                alert('New PINs do not match')
                            }
                        }}
                    />
                    <ButtonOneUnfilled
                        title="Cancel"
                        onPress={() => {
                            setEditPin(false)
                        }}
                    />
                </View>}
        </View>
    )
}


export default SettingsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    sectionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: colors.surface,
        padding: spacings.large,
        marginTop: spacings.medium,
        elevation: 1,
    },
    sectionHeading: {
        ...textStyles.body,
        marginLeft: spacings.medium,
    },
    editPinContainer: {
        flex: 1,
        padding: spacings.large,
        marginTop: spacings.medium,
        backgroundColor: colors.surface,
        elevation: 1,
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