import { StyleSheet, Button, Text, View, Alert, ScrollView } from 'react-native'
import React from 'react'
import { colors, opacities, spacings, textStyles, textInputStyles, ButtonOne, ButtonTwo, SelectStory, DividerVertical, DividerHorizontal, ButtonTwoUnfilled, iconSizes, ButtonOneUnfilled } from '../context/DesignSystem';
import { UserContext } from '../context/UserContext'

const UsersScreen = ({ navigation }) => {
    const { currentUser, users, deleteUser } = React.useContext(UserContext)

    const usersForDisplay = users.filter(user => user.id !== currentUser.id)

    const usersList = usersForDisplay.map((user, index) => {
        return (
            <View key={index} style={styles.userContainer}>
                <View style={styles.userInfoContainer}>
                    <Text style={styles.userNameText} >
                        {user.name}
                    </Text>
                    <Text style={styles.userPhoneText} >
                        M: {user.phone}
                    </Text>
                    <Text style={styles.userRoleText} >
                        {user.userType}
                    </Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <ButtonTwo
                        style={{ marginRight: 10 }}
                        title="Edit"
                        onPress={() => {
                            navigation.navigate('Create New User', { userToEdit: user, title: 'Edit User' })
                        }}
                    />
                    <ButtonTwoUnfilled
                        title="Delete"
                        onPress={() => {
                            Alert.alert(
                                'Delete User',
                                'Are you sure you want to delete ' + user.name + '?',
                                [
                                    {
                                        text: 'Cancel',
                                        onPress: () => { console.log('Cancel Pressed') },
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'OK', onPress: async () => {
                                            await deleteUser(user)
                                            alert(user.name + ' deleted successfully!')
                                        }
                                    },
                                ],
                                { cancelable: true },
                            )
                        }}
                    />

                </View>
            </View>
        )
    })

    return (
        <View style={styles.container} >
            <View style={styles.topButtonContainer}>
                <ButtonOne
                    title="Create New User"
                    onPress={() => {
                        navigation.navigate('Create New User', { userToEdit: {} })
                    }}
                />
            </View>
            <ScrollView style={styles.listContainer}>
                <Text style={styles.sectionHeading}>
                    Users
                </Text>
                {usersList}
            </ScrollView>
        </View>
    )
}

export default UsersScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topButtonContainer: {
        padding: spacings.large,
        backgroundColor: colors.surface,
        elevation: 2,
    },
    userContainer: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        elevation: 2,
        marginBottom: spacings.medium,
        padding: spacings.medium,
        borderRadius: 4,
        justifyContent: 'space-between',
    },
    listContainer: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacings.large,
        paddingTop: spacings.large,
    },
    sectionHeading: {
        ...textStyles.heading2,
        marginBottom: spacings.large,
    },
    userNameText: {
        ...textStyles.heading2,
        marginRight: spacings.large,
    },
    userPhoneText: {
        ...textStyles.caption,
        color: colors.text,
        marginTop: spacings.small,
    },
    userRoleText: {
        ...textStyles.caption,
        color: colors.error,
        marginTop: spacings.small,
    },
    userInfoContainer: {
        flex: 1,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'flex-end',
    },




})