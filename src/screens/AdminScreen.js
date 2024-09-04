import { StyleSheet, Button, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors, opacities, spacings, textStyles, textInputStyles, ButtonOne, ButtonTwo, SelectStory, DividerVertical, DividerHorizontal, ButtonTwoUnfilled, iconSizes, ButtonOneUnfilled } from '../context/DesignSystem';
import { UserContext } from '../context/UserContext'

const Screen = ({ navigation }) => {
    const { currentUser } = React.useContext(UserContext)

    return (
        <View style={styles.container} >

            <View style={styles.sectionContainer}>
                <TouchableOpacity
                    style={styles.buttonContainerUsers}
                    onPress={() => {
                        navigation.navigate('Users')
                    }}
                >
                    <Text style={styles.buttonText}>
                        Manage Users
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.sectionContainer}>
                <TouchableOpacity
                    style={styles.buttonContainerSettings}
                    onPress={() => {
                        navigation.navigate('Rules')
                    }}
                >
                    <Text style={styles.buttonText}>
                        Manage Rules
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Screen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        ...textStyles.heading2,
        marginBottom: 10,
    },
    buttonContainerUsers: {
        width: '100%',
        backgroundColor: "#C9C5E9",
        paddingVertical: spacings.large,
        marginTop: spacings.large,
        borderRadius: 4,
        elevation: 2,
    },
    buttonContainerSupply: {
        width: '100%',
        backgroundColor: colors.surfaceGreen,
        paddingVertical: spacings.large,
        borderRadius: 4,
        elevation: 2,
    },
    buttonContainerDemand: {
        width: '100%',
        backgroundColor: colors.surfaceYellow,
        paddingVertical: spacings.large,

        borderRadius: 4,
        elevation: 2,
    },
    buttonContainerSettings: {
        width: '100%',
        backgroundColor: colors.background,
        paddingVertical: spacings.large,
        borderRadius: 4,
        elevation: 2,
    },
    buttonText: {
        ...textStyles.heading1,
        fontWeight: "bold",
        textAlign: "center",
        color: colors.primaryDark,
        marginVertical: spacings.small,
    },

})