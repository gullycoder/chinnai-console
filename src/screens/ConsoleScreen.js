import { StyleSheet, ScrollView, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors, opacities, spacings, textStyles, textInputStyles, ButtonOne, ButtonTwo, SelectStory, DividerVertical, DividerHorizontal, ButtonTwoUnfilled, iconSizes, ButtonOneUnfilled, RadioButtons } from '../context/DesignSystem';
import { UserContext } from '../context/UserContext'
import { SupplyContext } from '../context/SupplyContext';

const ConsoleScreen = ({ navigation }) => {
    const { contractors, fetchContractors, createContractor } = React.useContext(SupplyContext)
    const { users, currentUser } = React.useContext(UserContext)

    const [filteredContractors, setFilteredContractors] = React.useState("All")

    React.useEffect(() => {
        const fetchData = async () => {
            await fetchContractors()
        }
        fetchData()
    }, [])

    const contractorsCreatedToday = contractors.filter(contractor => {
        return contractor.createdAt.toDate().toDateString() === new Date().toDateString()
    })

    const TableRow = ({ user, contractors }) => {
        const userContractors = contractors?.filter(contractor => contractor.userRMId === user.id)
        const totalSiteVisits = userContractors?.filter(contractor => contractor.userOnboardingStatus === "Client site visited").length
        const totalAwardedContractors = userContractors?.filter(contractor => contractor.userOnboardingStatus === "Tender Awarded").length

        return (
            <View style={styles.tableRow}>
                <TouchableOpacity
                    style={styles.tableRowItem}
                    onPress={() => {
                        navigation.navigate('Supply', { userId: user.id })
                    }}
                >
                    <Text style={[styles.tableRowItemText, { color: colors.primary }]}>{user.name}</Text>
                </TouchableOpacity>
                <View style={styles.tableRowItem}>
                    <Text style={styles.tableRowItemText}>{userContractors.length}</Text>
                </View>
                <View style={styles.tableRowItem}>
                    <Text style={styles.tableRowItemText}>{totalSiteVisits}</Text>
                </View>
                <View style={styles.tableRowItem}>
                    <Text style={styles.tableRowItemText}>{totalAwardedContractors}</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container} >
            <ScrollView style={styles.scrollView}>
                <View style={styles.sectionContainer}>
                    <TouchableOpacity
                        style={styles.buttonContainerSupply}
                        onPress={() => {
                            navigation.navigate('Supply')
                        }}
                    >
                        <Text style={styles.buttonText}>
                            Supply
                        </Text>
                    </TouchableOpacity>
                    <RadioButtons
                        titlesArray={["All", "Today"]}
                        selected={filteredContractors}
                        setSelected={setFilteredContractors}
                        containerStyle={styles.radioButtonsContainerWrapped}
                        style={styles.radioButtonsWrapped}
                    />
                    <View style={styles.tableContainer} >
                        <View style={styles.tableHeader}>
                            <Text style={styles.tableHeaderText}>
                                RM Name
                            </Text>
                            <Text style={styles.tableHeaderText}>
                                Contractors
                            </Text>
                            <Text style={styles.tableHeaderText}>
                                Site visits
                            </Text>
                            <Text style={styles.tableHeaderText}>
                                Awarded
                            </Text>
                        </View>
                        {users?.map((user, index) => {
                            if (filteredContractors === "All") {
                                return <TableRow key={index} user={user} contractors={contractors} />
                            } else if (filteredContractors === "Today") {
                                return <TableRow key={index} user={user} contractors={contractorsCreatedToday} />
                            }
                        })}
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <TouchableOpacity
                        style={styles.buttonContainerDemand}
                        onPress={() => {
                            navigation.navigate('Demand')
                        }}
                    >
                        <Text style={styles.buttonText}>
                            Demand
                        </Text>
                    </TouchableOpacity>
                </View>
                {currentUser.userType === 'Admin' &&
                    <View style={styles.sectionContainer}>
                        <TouchableOpacity
                            style={styles.buttonContainerUsers}
                            onPress={() => {
                                navigation.navigate('Admin')
                            }}
                        >
                            <Text style={styles.buttonText}>
                                Admin Section
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
                <View style={styles.sectionContainer}>
                    <TouchableOpacity
                        style={styles.buttonContainerSettings}
                        onPress={() => {
                            navigation.navigate('Settings')
                        }}
                    >
                        <Text style={styles.buttonText}>
                            Settings
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

export default ConsoleScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    scrollView: {
        flex: 1,
    },
    sectionContainer: {
        marginTop: spacings.large,
        paddingHorizontal: spacings.large * 1.5,
    },
    buttonContainerUsers: {
        width: '100%',
        backgroundColor: "#C9C5E9",
        paddingVertical: spacings.large,
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
    tableContainer: {
        padding: spacings.small,
        marginBottom: spacings.medium,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.surfaceGreen,
    },
    tableHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: colors.primaryDark,
    },
    tableHeaderText: {
        ...textStyles.heading3,
        fontWeight: "bold",
        color: colors.primaryDark,
        textAlign: "center",
        marginVertical: spacings.small,
    },
    tableRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    tableRowItem: {
        flex: 1,
    },
    tableRowItemText: {
        ...textStyles.heading3,
        fontWeight: "bold",
        textAlign: "center",
        color: colors.primaryDark,
        marginVertical: spacings.small,
    },
    radioButtonsContainerWrapped: {
        margin: spacings.small,
        marginRight: 0,
        marginBottom: 0,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    radioButtonsWrapped: {
        marginRight: spacings.small,
        flex: 1,
    },

})