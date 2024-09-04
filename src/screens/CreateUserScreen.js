import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import React from 'react'
import { colors, opacities, spacings, textStyles, textInputStyles, ButtonOne, ButtonTwo, SelectStory, DividerVertical, DividerHorizontal, ButtonTwoUnfilled, iconSizes, ButtonOneUnfilled, RadioButtons } from '../context/DesignSystem';
import { UserContext } from '../context/UserContext';

const CreateUserScreen = ({ navigation, route }) => {
    const { userToEdit } = route.params
    const { createUser, updateUser } = React.useContext(UserContext)
    const [user, setUser] = React.useState({
        ...userToEdit,
    });

    return (
        <View
            style={styles.container}
        >
            <Text style={styles.label} >
                Name*
            </Text>
            <TextInput
                value={user.name}
                onChangeText={(text) => setUser({ ...user, name: text })}
                style={styles.textInput}
                autoCapitalize="words"
                autoFocus={true}
                placeholder="Enter name"
            />
            <Text style={styles.label} >
                Phone (10 digit number)*
            </Text>
            <TextInput
                value={user.phone}
                onChangeText={(text) => setUser({ ...user, phone: text })}
                style={styles.textInput}
                placeholder="Enter 10 digit phone number"
                keyboardType="numeric"
                maxLength={10}
            />
            <Text style={styles.label} >
                PIN (4 digit number)*
            </Text>
            <TextInput
                value={user.pin}
                onChangeText={(text) => setUser({ ...user, pin: text })}
                style={styles.textInput}
                placeholder="Enter 4 digit PIN"
                keyboardType="numeric"
                maxLength={4}
            />
            <Text style={styles.label} >
                Select user type*
            </Text>
            <View style={styles.sectionContainer}>
                <RadioButtons
                    titlesArray={['Admin', 'User']}
                    selected={user.userType}
                    setSelected={(selected) => {
                        setUser({ ...user, userType: selected })
                    }}
                />
            </View>
            <ButtonOne
                title={Object.keys(userToEdit).length > 0 ? 'Save' : 'Create'}
                onPress={async () => {
                    if (user.name && user.phone && user.pin && user.userType && user.pin.length === 4 && user.phone.length === 10) {
                        if (Object.keys(userToEdit).length > 0) {
                            const result = await updateUser(user);
                            if (result.error) {
                                alert(result.error);
                            } else {
                                navigation.goBack();
                                alert(result.user.name + " edited successfully!");
                            }
                        } else {
                            const result = await createUser(user);
                            if (result.error) {
                                alert(result.error);
                            } else {
                                navigation.goBack();
                                alert(result.user.name + " created successfully!");
                            }
                        }
                    } else {
                        alert('Please check that if all the fields are filled correctly')
                    }
                }}
            />
            <ButtonOneUnfilled
                title="Cancel"
                style={{ marginTop: spacings.medium, marginBottom: spacings.medium }}
                onPress={() => {
                    navigation.goBack();
                }}
            />


        </View>
    )
}

export default CreateUserScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    sectionContainer: {
        marginTop: 5,
        marginBottom: 10,
        padding: 10,
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