import { StyleSheet, TextInput, Button, TouchableOpacity, Text, View, Alert, ScrollView } from 'react-native'
import React from 'react'
import { colors, opacities, spacings, textStyles, textInputStyles, ButtonOne, ButtonTwo, SelectStory, DividerVertical, DividerHorizontal, ButtonTwoUnfilled, iconSizes, ButtonOneUnfilled, RadioButtons, RadioButtonsTemp } from '../context/DesignSystem';
import { SupplyContext } from '../context/SupplyContext'
import { UserContext } from '../context/UserContext';
import { MaterialIcons } from '@expo/vector-icons';
import ContractorThumbnail from '../components/ContractorThumbnail';



const SupplyScreen = ({ route, navigation }) => {
    const { userId } = route.params || {};
    const { contractors, createContractor, fetchTechnicalProfiles } = React.useContext(SupplyContext)
    const { currentUser, rules } = React.useContext(UserContext)

    React.useEffect(() => {
        const fetchData = async () => {
            await fetchTechnicalProfiles()
        }
        fetchData()
    }, [])

    const [contractor, setContractor] = React.useState({
        userType: "contractor",
        userRMId: currentUser.id,
    })

    const [loading, setLoading] = React.useState(false);

    const [selectedOnboardingStatus, setSelectedOnboardingStatus] = React.useState("All");
    const [selectedOnboardingAction, setSelectedOnboardingAction] = React.useState("All");
    const [selectedOnboardingActionDate, setSelectedOnboardingActionDate] = React.useState("All");
    const [selectedCreatedAt, setSelectedCreatedAt] = React.useState("All");

    const [searchText, setSearchText] = React.useState("");

    // phone number validation regex
    const phoneRegex = /^[6-9]\d{9}$/

    const validatePhone = (phone) => {
        if (phoneRegex.test(phone)) {
            console.log("valid phone")
            return true;
        } else {
            console.log("invalid phone")
            return false;
        }
    }

    const myContractors = contractors.filter((contractor) => {
        if (userId) {
            return contractor.userRMId === userId
        } else {
            return contractor.userRMId === currentUser.id
        }
    })


    const filteredContractors = myContractors.filter(contractor => {
        const contractorOnboardingActionDate = contractor.userOnboardingActionDate ? contractor.userOnboardingActionDate.toDate().toDateString() : ''
        const selectedOnboardingActionDateConverted = (
            selectedOnboardingActionDate === "Today"
                ? new Date().toDateString()
                : selectedOnboardingActionDate === "Tomorrow"
                    ? new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toDateString()
                    : selectedOnboardingActionDate === "All"
                        ? "All"
                        : ''
        )
        const contractorCreatedAt = contractor.createdAt ? contractor.createdAt.toDate().toDateString() : ''
        const selectedContractorCreateAtConverted = (
            selectedCreatedAt === "Today"
                ? new Date().toDateString()
                : selectedCreatedAt === "Yesterday"
                    ? new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toDateString()
                    : selectedCreatedAt === "All"
                        ? "All"
                        : ''
        )
        const contractorOnboardingAction = (
            contractor.userOnboardingAction === "Follow up"
                ? "Follow up"
                : (contractor.userOnboardingAction === "Meeting - Contractor site" || contractor.userOnboardingAction === "Meeting - Client site" || contractor.userOnboardingAction === "Meeting - Office")
                    ? "Meeting"
                    : "All"
        )

        return (
            (selectedOnboardingStatus === "All" || contractor.userOnboardingStatus === selectedOnboardingStatus) &&
            (selectedOnboardingAction === "All" || contractorOnboardingAction === selectedOnboardingAction) &&
            (selectedOnboardingActionDate === "All" || contractorOnboardingActionDate === selectedOnboardingActionDateConverted) &&
            (selectedCreatedAt === "All" || contractorCreatedAt === selectedContractorCreateAtConverted)
        )
    })

    const filteredContractorsSearched = filteredContractors.filter(contractor => {
        const contractorName = contractor.userName?.toLowerCase()
        const searchTextLowerCase = searchText.toLowerCase()
        if (searchTextLowerCase === "") {
            return true
        } else if (contractorName) {
            return contractorName.includes(searchTextLowerCase)
        } else {
            return false
        }
    })


    //sort filtered contractors by updatedAt date
    const sortedContractors = filteredContractorsSearched.sort((a, b) => {
        if (!a.updatedAt) {
            return -1
        } else if (!b.updatedAt) {
            return -1
        } else {
            return new Date(b.updatedAt.toDate()) - new Date(a.updatedAt.toDate())
        }
    })


    const sortedContractorsList = sortedContractors.map((contractor, index) => {
        return (
            <ContractorThumbnail
                key={index}
                contractor={contractor}
                navigation={navigation}
            />
        )
    })


    return (
        <View style={styles.container} >
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.topButtonContainer}>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            style={styles.textInput}
                            value={contractor.userId}
                            placeholder="Phone (10 digits)"
                            onChangeText={(text) => setContractor({ ...contractor, phone: `+91${text}`, userId: text })}
                            keyboardType="phone-pad"
                            textContentType="telephoneNumber"
                        />
                        {contractor.userId?.length > 0 &&
                            <TouchableOpacity
                                style={styles.clearTextIconContainer}
                                onPress={() => { setContractor({ ...contractor, phone: '', userId: '' }) }}
                            >
                                <MaterialIcons name="add" size={iconSizes.large} color={colors.textDark}
                                    style={{ transform: [{ rotate: '45deg' }] }}
                                />
                            </TouchableOpacity>
                        }
                    </View>
                    <ButtonOne
                        title="Add New / Edit Contractor"
                        style={{ marginTop: spacings.medium }}
                        disabled={loading}
                        onPress={() => {
                            setLoading(true);
                            if (validatePhone(contractor.userId)) {
                                const createNewContractor = async () => {
                                    try {
                                        const result = await createContractor(contractor)
                                        if (result.error) {
                                            setLoading(false);
                                            if (result.error === "Contractor already exists") {
                                                Alert.alert(
                                                    "Contractor already exists",
                                                    "Do you want to edit the existing contractor?",
                                                    [
                                                        {
                                                            text: "Cancel",
                                                            onPress: () => {
                                                                setLoading(false);
                                                            },
                                                            style: "cancel"
                                                        },
                                                        {
                                                            text: "Edit",
                                                            onPress: () => {
                                                                navigation.navigate('Add New Contractor', { contractorId: contractor.userId, title: 'Edit Contractor' })
                                                            }
                                                        }
                                                    ],
                                                    { cancelable: false }
                                                )

                                            } else {
                                                alert(result.error)
                                            }
                                        }
                                        else {
                                            setLoading(false);
                                            navigation.navigate('Add New Contractor', { contractorId: contractor.userId, title: 'Add New Contractor' })
                                            alert("New contractor created successfully!");
                                        }
                                    } catch (error) {
                                        setLoading(false);
                                        alert(error);
                                    }
                                }
                                createNewContractor();
                            } else {
                                setLoading(false);
                                alert("Please enter a valid mobile number (10 digits)");
                            }
                        }}
                    />
                </View>
                <DividerHorizontal />
                <View style={styles.filtersContainer}>
                    <Text style={styles.heading}>
                        Filter by
                    </Text>
                    <View style={styles.filterContainer}>
                        <Text style={styles.filterText}>
                            Status:
                        </Text>
                        <RadioButtonsTemp
                            titlesArray={["All", ...rules.rulesOnboardingStatus]}
                            selected={selectedOnboardingStatus}
                            setSelected={setSelectedOnboardingStatus}
                            style={styles.radioButtons}
                            horizontal
                        />
                    </View>
                    <View style={styles.filterContainer}>
                        <Text style={styles.filterText}>
                            Action:
                        </Text>
                        <RadioButtonsTemp
                            titlesArray={["All", "Follow up", "Meeting"]}
                            selected={selectedOnboardingAction}
                            setSelected={setSelectedOnboardingAction}
                            style={styles.radioButtons}
                            horizontal
                        />
                    </View>
                    <View style={styles.filterContainer}>
                        <Text style={styles.filterText}>
                            Action Date:
                        </Text>
                        <RadioButtonsTemp
                            titlesArray={["All", "Today", "Tomorrow"]}
                            selected={selectedOnboardingActionDate}
                            setSelected={(title) => {
                                setSelectedOnboardingActionDate(title)
                            }}
                            style={styles.radioButtons}
                            horizontal
                        />
                    </View>
                    <View style={styles.filterContainer}>
                        <Text style={styles.filterText}>
                            Created At:
                        </Text>
                        <RadioButtonsTemp
                            titlesArray={["All", "Today", "Yesterday"]}
                            selected={selectedCreatedAt}
                            setSelected={(title) => {
                                setSelectedCreatedAt(title)
                            }}
                            style={styles.radioButtons}
                            horizontal
                        />
                    </View>
                </View>
                <View style={styles.headerContainer}>
                    <Text style={styles.heading}>
                        My contractors ({filteredContractorsSearched.length})
                    </Text>
                    <TextInput
                        style={styles.searchTextInput}
                        placeholder="Search name"
                        onChangeText={(text) => setSearchText(text)}
                        value={searchText}
                    />
                </View>
                <View style={styles.listContainer}>
                    {sortedContractorsList}
                </View>
            </ScrollView>
        </View>
    )
}

export default SupplyScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    textInputContainer: {
        justifyContent: 'center',
    },
    textInput: {
        ...textInputStyles.large,
        textAlign: "center",
        letterSpacing: 2,
    },
    clearTextIconContainer: {
        position: "absolute",
        right: spacings.small,
        justifyContent: "center",
        alignItems: "center",
        width: spacings.medium * 2.5,
        height: spacings.medium * 2.5,
        borderRadius: spacings.medium * 1.25,
        backgroundColor: colors.borderDisabled,
    },

    topButtonContainer: {
        padding: spacings.large,
        backgroundColor: colors.surface,
        elevation: 2,
    },
    contractorContainer: {
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
    contractorNameText: {
        ...textStyles.heading2,
        marginRight: spacings.large,
    },
    contractorPhoneText: {
        ...textStyles.caption,
        color: colors.text,
        marginTop: spacings.small,
    },
    contractorRoleText: {
        ...textStyles.caption,
        color: colors.error,
        marginTop: spacings.small,
    },
    contractorInfoContainer: {
        flex: 1,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacings.medium,
    },
    buttonContainerLeft: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    callButton: {
        flex: 1,
        justifyContent: 'center',
        marginRight: spacings.small,
    },
    messageButton: {
        justifyContent: 'center',
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: spacings.large,
        paddingVertical: spacings.medium,
        backgroundColor: colors.surfaceYellow,
        alignItems: "center",
    },
    filtersContainer: {
        padding: spacings.large,
        backgroundColor: colors.surface,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: spacings.small,
    },
    filterText: {
        ...textStyles.caption,
        fontWeight: 'bold',
        marginRight: spacings.small,
    },
    heading: {
        ...textStyles.heading2,
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    radioButtons: {
        marginRight: spacings.small,
        marginBottom: 0,
    },
    searchTextInput: {
        ...textInputStyles.small,
        borderColor: colors.secondaryDark,
        width: '50%',
        height: "100%",
        paddingVertical: spacings.medium / 2,
        backgroundColor: colors.backgroundYellow,
        borderWidth: 0.25,
    },


})