import { StyleSheet, Alert, Text, View, ActivityIndicator, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native'
import { colors, opacities, spacings, textStyles, textInputStyles, ButtonOne, ButtonTwo, SelectStory, DividerVertical, DividerHorizontal, ButtonTwoUnfilled, iconSizes, ButtonOneUnfilled, RadioButtons, RadioButtonsTemp, CheckBoxes } from '../context/DesignSystem';
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { SupplyContext } from '../context/SupplyContext';
import { UserContext } from '../context/UserContext';
import DateTimePicker from '@react-native-community/datetimepicker';



const CreateContractorScreen = ({ route, navigation }) => {
    const { contractorId } = route.params
    const { contractors, technicalProfiles, fetchTechnicalProfiles, updateContractor } = React.useContext(SupplyContext)
    const { rules, users, currentUser } = React.useContext(UserContext)


    const technicalProfilesForContractor = technicalProfiles.filter(technicalProfile => technicalProfile.contractorId === contractorId)

    const barbendingStatus = technicalProfilesForContractor.find(technicalProfile => technicalProfile.tenderType === "Barbending")?.verificationStatus
    const shutteringStatus = technicalProfilesForContractor.find(technicalProfile => technicalProfile.tenderType === "Shuttering")?.verificationStatus
    const masonryStatus = technicalProfilesForContractor.find(technicalProfile => technicalProfile.tenderType === "Masonry")?.verificationStatus
    const plasteringStatus = technicalProfilesForContractor.find(technicalProfile => technicalProfile.tenderType === "Plastering")?.verificationStatus
    const othersStatus = technicalProfilesForContractor.find(technicalProfile => technicalProfile.tenderType === "Others")?.verificationStatus

    const contractorToEdit = contractorId ? contractors.find(contractor => contractor.userId === contractorId) : null

    const [contractor, setContractor] = React.useState({
        ...contractorToEdit,
    })

    const [loading, setLoading] = React.useState(false);
    const [showSwitchRM, setShowSwitchRM] = React.useState(false);

    const [expandedBasicInfo, setExpandedBasicInfo] = React.useState(true)
    const [expandedPreferences, setExpandedPreferences] = React.useState(true)
    const [expandedTechProfiles, setExpandedTechProfiles] = React.useState(true)
    const [expandedOnboarding, setExpandedOnboarding] = React.useState(true)


    const [date, setDate] = React.useState(
        contractorToEdit.userOnboardingActionDate ? contractorToEdit.userOnboardingActionDate.toDate() : new Date()
    )
    const [mode, setMode] = React.useState('date');
    const [show, setShow] = React.useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
        setContractor({ ...contractor, userOnboardingActionDate: currentDate })
    };
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
    const showDatepicker = () => {
        showMode('date');
    };

    const callPhoneNumber = () => {
        Linking.openURL(`tel:${contractor.phone}`);
    }
    const sendWhatsappMessage = () => {
        try {
            const message = rules.rulesWhatsappMessage1;
            Linking.openURL(`whatsapp://send?text=${message}&phone=${contractor.phone}`);
            console.log('whatsapp message sent');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.topContainer}>
                    <Text style={[styles.label, { marginBottom: spacings.small / 2 }]}>
                        Name: <Text style={[styles.label, { fontSize: 14 }]}>{contractor.userName}</Text>
                    </Text>
                    <Text style={[styles.label, { marginBottom: spacings.small / 2 }]}>
                        Phone:
                        <Text style={[styles.label, { fontSize: 14 }]}> {contractor.phone}</Text>
                    </Text>
                    <Text style={[styles.label]}>
                        RM's Name:
                        <Text style={[styles.label, { fontSize: 16, color: colors.primary }]}> {users.find(user => user.id === contractor.userRMId)?.name}</Text>
                    </Text>
                    {currentUser.userType === "Admin" &&
                        <TouchableOpacity
                            style={styles.switchRMIconContainer}
                            onPress={() => {
                                setShowSwitchRM(!showSwitchRM)
                            }}>
                            <MaterialIcons name="switch-account" size={spacings.medium * 2.5} color={colors.primaryDark} />
                        </TouchableOpacity>
                    }
                    <Modal
                        animationType="slide"
                        visible={showSwitchRM}
                        onRequestClose={() => {
                            setShowSwitchRM(false);
                        }}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modal}>
                                <Text style={styles.modalTitle}>Select RM</Text>
                                <RadioButtons
                                    titlesArray={users.map(user => user.name)}
                                    selected={users.find(user => user.id === contractor.userRMId)?.name}
                                    setSelected={(selected) => {
                                        setContractor({ ...contractor, userRMId: users.find(user => user.name === selected)?.id })
                                        setShowSwitchRM(false);
                                    }
                                    }
                                />
                                <ButtonTwoUnfilled
                                    title="Cancel"
                                    onPress={() => {
                                        setShowSwitchRM(false);
                                    }}
                                    style={styles.modalCancelButton}
                                />
                            </View>
                        </View>
                    </Modal>
                    <View style={styles.topButtonsContainer}>
                        <ButtonTwo
                            title={'Call'}
                            onPress={() => callPhoneNumber()}
                            style={styles.callButton}
                        />
                        <ButtonTwoUnfilled
                            title={'Whatsapp'}
                            onPress={() => sendWhatsappMessage()}
                            style={styles.messageButton}
                        />

                    </View>
                </View>
                <TouchableOpacity
                    style={styles.headerContainer}
                    onPress={() => {
                        setExpandedBasicInfo(!expandedBasicInfo)
                    }}
                >
                    <Text style={styles.heading}>
                        Basic Details
                    </Text>
                    {expandedBasicInfo
                        ? <MaterialIcons name="keyboard-arrow-up" size={iconSizes.medium} color={colors.primary} />
                        : <MaterialIcons name="keyboard-arrow-down" size={iconSizes.medium} color={colors.primary} />
                    }
                </TouchableOpacity>
                {expandedBasicInfo &&
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Lead source
                        </Text>
                        <RadioButtons
                            titlesArray={rules.rulesLeadSources}
                            selected={contractor.userLeadSource}
                            setSelected={(value) => setContractor({ ...contractor, userLeadSource: value })}
                            containerStyle={styles.radioButtonsContainerWrapped}
                            style={styles.radioButtonsWrapped}
                        />
                        {contractor.userLeadSource === "Referral" &&
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>
                                    Referrer Name
                                </Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={contractor.userReferrerName}
                                    autoCapitalize="words"
                                    placeholder="Enter referrer name"
                                    onChangeText={(value) => setContractor({ ...contractor, userReferrerName: value })}
                                />
                                <Text style={styles.label}>
                                    Referrer Phone (10 digit)
                                </Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={contractor.userReferrerPhone}
                                    placeholder="Enter referrer phone"
                                    keyboardType="numeric"
                                    maxLength={10}
                                    onChangeText={(value) => setContractor({ ...contractor, userReferrerPhone: value })}
                                />
                            </View>
                        }
                        <Text style={styles.label}>
                            Name
                        </Text>
                        <TextInput
                            style={styles.textInput}
                            value={contractor.userName}
                            placeholder="Enter contractor name"
                            onChangeText={(text) => setContractor({ ...contractor, userName: text })}
                            autoCapitalize="words"
                        />
                        <Text style={styles.label}>
                            Company/Business Name
                        </Text>
                        <TextInput
                            style={styles.textInput}
                            value={contractor.userCompanyName}
                            placeholder="Enter company/business name"
                            onChangeText={(text) => setContractor({ ...contractor, userCompanyName: text })}
                            autoCapitalize="words"
                        />
                        <Text style={styles.label}>
                            Contractor type
                        </Text>
                        <RadioButtons
                            titlesArray={rules.rulesContractorTypes}
                            selected={contractor.userContractorType}
                            setSelected={(value) => setContractor({ ...contractor, userContractorType: value })}
                            containerStyle={styles.radioButtonsContainerWrapped}
                            style={styles.radioButtonsWrapped}
                        />
                        <Text style={styles.label}>
                            Location (city)
                        </Text>
                        <TextInput
                            style={styles.textInput}
                            value={contractor.userCity}
                            placeholder="Enter location (city)"
                            onChangeText={(text) => setContractor({ ...contractor, userCity: text })}
                            autoCapitalize="words"
                        />
                        <Text style={styles.label}>
                            GSTIN
                        </Text>
                        <TextInput
                            style={styles.textInput}
                            value={contractor.userGSTIN}
                            placeholder="Enter GSTIN"
                            onChangeText={(text) => setContractor({ ...contractor, userGSTIN: text })}
                            autoCapitalize="characters"
                            maxLength={15}
                        />
                        <Text style={styles.label}>
                            PAN
                        </Text>
                        <TextInput
                            style={styles.textInput}
                            value={contractor.userPAN}
                            placeholder="Enter PAN"
                            onChangeText={(text) => setContractor({ ...contractor, userPAN: text })}
                            autoCapitalize="characters"
                            maxLength={10}
                        />
                        <Text style={styles.label}>
                            Total manpower (claimed)
                        </Text>
                        <RadioButtons
                            titlesArray={rules.rulesManpower}
                            selected={contractor.userTotalManpowerClaimed}
                            setSelected={(value) => setContractor({ ...contractor, userTotalManpowerClaimed: value })}
                            containerStyle={styles.radioButtonsContainerWrapped}
                            style={styles.radioButtonsWrapped}
                        />
                        <Text style={styles.label}>
                            Annual Turnover (claimed)
                        </Text>
                        <RadioButtons
                            titlesArray={rules.rulesAnnualTurnover}
                            selected={contractor.userTurnoverClaimed}
                            setSelected={(value) => setContractor({ ...contractor, userTurnoverClaimed: value })}
                            containerStyle={styles.radioButtonsContainerWrapped}
                            style={styles.radioButtonsWrapped}
                        />
                    </View>
                }
                <TouchableOpacity
                    style={styles.headerContainer}
                    onPress={() => {
                        setExpandedPreferences(!expandedPreferences)
                    }}
                >
                    <Text style={styles.heading}>
                        Contractor Preferences
                    </Text>
                    {expandedPreferences
                        ? <MaterialIcons name="keyboard-arrow-up" size={iconSizes.medium} color={colors.primary} />
                        : <MaterialIcons name="keyboard-arrow-down" size={iconSizes.medium} color={colors.primary} />
                    }
                </TouchableOpacity>
                {expandedPreferences &&
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Contractor's service region
                        </Text>
                        <TextInput
                            style={styles.textInput}
                            value={contractor.userServiceRegion}
                            placeholder="Enter service region"
                            onChangeText={(text) => setContractor({ ...contractor, userServiceRegion: text })}
                            autoCapitalize="words"
                        />
                        <Text style={styles.label}>
                            Project types he is interested in
                        </Text>
                        <RadioButtons
                            titlesArray={rules.rulesProjectTypes}
                            selected={contractor.userProjectTypes}
                            setSelected={(value) => setContractor({ ...contractor, userProjectTypes: value })}
                            containerStyle={styles.radioButtonsContainerWrapped}
                            style={styles.radioButtonsWrapped}
                        />
                        <Text style={styles.label}>
                            Does he require Kharchi?
                        </Text>
                        <RadioButtons
                            titlesArray={["Yes", "No"]}
                            selected={contractor.userKharchiRequired}
                            setSelected={(value) => setContractor({ ...contractor, userKharchiRequired: value })}
                            containerStyle={styles.radioButtonsContainerHorizontal}
                            style={styles.radioButtonsHorizontal}
                        />
                        {contractor.userKharchiRequired === "Yes" &&
                            <>
                                <Text style={styles.label}>
                                    Weekly kharchi per worker (in Rs.)
                                </Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={contractor.userWeeklyKharchi}
                                    placeholder="Enter weekly kharchi value"
                                    onChangeText={(text) => setContractor({ ...contractor, userWeeklyKharchi: text })}
                                    keyboardType="number-pad"
                                    maxLength={4}
                                />
                            </>
                        }
                        <Text style={styles.label}>
                            Does he have supervisory staff?
                        </Text>
                        <RadioButtons
                            titlesArray={["Yes", "No"]}
                            selected={contractor.userSupervisoryStaff}
                            setSelected={(value) => setContractor({ ...contractor, userSupervisoryStaff: value })}
                            containerStyle={styles.radioButtonsContainerHorizontal}
                            style={styles.radioButtonsHorizontal}
                        />
                    </View>
                }
                <TouchableOpacity
                    style={styles.headerContainer}
                    onPress={() => {
                        setExpandedTechProfiles(!expandedTechProfiles)
                    }}
                >
                    <Text style={styles.heading}>
                        Technical Profile
                    </Text>
                    {expandedTechProfiles
                        ? <MaterialIcons name="keyboard-arrow-up" size={iconSizes.medium} color={colors.primary} />
                        : <MaterialIcons name="keyboard-arrow-down" size={iconSizes.medium} color={colors.primary} />
                    }
                </TouchableOpacity>
                {expandedTechProfiles &&
                    <View style={styles.techProfilesContainer}>
                        <Text style={styles.label}>
                            Work types that contractor has done in the past (claimed)
                        </Text>
                        <CheckBoxes
                            titlesArray={["Barbending", "Shuttering", "Brickwork / Blockwork", "Plastering", "Others"]}
                            selectedArray={contractor.userPastTenderTypes ? contractor.userPastTenderTypes : []}
                            setSelectedArray={(value) => setContractor({ ...contractor, userPastTenderTypes: value })}
                            containerStyle={styles.checkBoxesContainer}
                            style={styles.checkBoxes}
                        />
                        <Text style={styles.label}>
                            Work types' details and verification
                        </Text>
                        <View style={styles.profileBoxesContainer}>
                            <TouchableOpacity
                                style={styles.techProfileContainer}
                                onPress={() => {
                                    navigation.navigate("Technical Profile", { title: "Barbending", contractor });
                                }}
                            >
                                <View style={styles.nameAndTagContainer}>
                                    <Text style={styles.sectionHeading}>
                                        Barbending
                                    </Text>
                                    <View style={styles.verificationTagContainer}>
                                        <Text style={[styles.verificationTag, { color: barbendingStatus === "Verified" ? colors.primary : colors.error }]}>
                                            {barbendingStatus === "Verified" ? "Verified" : "Not Verified"}
                                        </Text>
                                    </View>
                                </View>
                                <MaterialIcons name="keyboard-arrow-right" size={iconSizes.large} color={colors.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.techProfileContainer}
                                onPress={() => {
                                    navigation.navigate("Technical Profile", { title: "Shuttering", contractor });
                                }}
                            >
                                <View style={styles.nameAndTagContainer}>

                                    <Text style={styles.sectionHeading}>
                                        Shuttering
                                    </Text>
                                    <View style={styles.verificationTagContainer}>
                                        <Text style={[styles.verificationTag, { color: shutteringStatus === "Verified" ? colors.primary : colors.error }]}>
                                            {shutteringStatus === "Verified" ? "Verified" : "Not Verified"}
                                        </Text>
                                    </View>
                                </View>
                                <MaterialIcons name="keyboard-arrow-right" size={iconSizes.large} color={colors.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.techProfileContainer}
                                onPress={() => {
                                    navigation.navigate("Technical Profile", { title: "Masonry", contractor });
                                }}
                            >
                                <View style={styles.nameAndTagContainer}>
                                    <Text style={styles.sectionHeading}>
                                        Brickwork / Blockwork
                                    </Text>
                                    <View style={styles.verificationTagContainer}>
                                        <Text style={[styles.verificationTag, { color: masonryStatus === "Verified" ? colors.primary : colors.error }]}>
                                            {masonryStatus === "Verified" ? "Verified" : "Not Verified"}
                                        </Text>
                                    </View>
                                </View>
                                <MaterialIcons name="keyboard-arrow-right" size={iconSizes.large} color={colors.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.techProfileContainer}
                                onPress={() => {
                                    navigation.navigate("Technical Profile", { title: "Plastering", contractor });
                                }}
                            >
                                <View style={styles.nameAndTagContainer}>
                                    <Text style={styles.sectionHeading}>
                                        Plastering
                                    </Text>
                                    <View style={styles.verificationTagContainer}>
                                        <Text style={[styles.verificationTag, { color: plasteringStatus === "Verified" ? colors.primary : colors.error }]}>
                                            {plasteringStatus === "Verified" ? "Verified" : "Not Verified"}
                                        </Text>
                                    </View>
                                </View>
                                <MaterialIcons name="keyboard-arrow-right" size={iconSizes.large} color={colors.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.techProfileContainer}
                                onPress={() => {
                                    navigation.navigate("Technical Profile", { title: "Others", contractor });
                                }}
                            >
                                <View style={styles.nameAndTagContainer}>
                                    <Text style={styles.sectionHeading}>
                                        Others
                                    </Text>
                                    <View style={styles.verificationTagContainer}>
                                        <Text style={[styles.verificationTag, { color: othersStatus === "Verified" ? colors.primary : colors.error }]}>
                                            {othersStatus === "Verified" ? "Verified" : "Not Verified"}
                                        </Text>
                                    </View>
                                </View>
                                <MaterialIcons name="keyboard-arrow-right" size={iconSizes.large} color={colors.icon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                <TouchableOpacity
                    style={styles.headerContainer}
                    onPress={() => {
                        setExpandedOnboarding(!expandedOnboarding)
                    }}
                >
                    <Text style={styles.heading}>
                        Onboarding
                    </Text>
                    {expandedOnboarding
                        ? <MaterialIcons name="keyboard-arrow-up" size={iconSizes.medium} color={colors.primary} />
                        : <MaterialIcons name="keyboard-arrow-down" size={iconSizes.medium} color={colors.primary} />
                    }
                </TouchableOpacity>
                {expandedOnboarding &&
                    <View style={styles.inputContainer}>

                        <Text style={styles.label}>
                            Onboarding actions COMPLETED
                        </Text>
                        <RadioButtons
                            titlesArray={rules.rulesOnboardingStatus}
                            selected={contractor.userOnboardingStatus}
                            setSelected={(value) => setContractor({ ...contractor, userOnboardingStatus: value })}
                            containerStyle={styles.radioButtonsContainerVertical}
                        />
                        <Text style={styles.label}>
                            Onboarding actions REQUIRED
                        </Text>
                        <RadioButtons
                            titlesArray={rules.rulesOnboardingActions}
                            selected={contractor.userOnboardingAction}
                            setSelected={(value) => setContractor({ ...contractor, userOnboardingAction: value })}
                            containerStyle={styles.radioButtonsContainerVertical}
                        />
                        <View style={[styles.inputContainer, { paddingTop: 0 }]}>
                            <Text style={styles.dateText}>
                                Date:
                                <Text
                                    style={[styles.dateText, { color: 'black', fontWeight: "bold" }]}
                                > {contractor.userOnboardingActionDate ? date.toDateString() : "Not selected"}</Text>
                            </Text>
                            <ButtonOneUnfilled onPress={showDatepicker} title="Add or Change Date" />
                            {show && (
                                <View style={styles.datePickerContainer}>
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={date}
                                        mode={mode}
                                        is24Hour={true}
                                        display="default"
                                        onChange={onChange}
                                    />
                                </View>
                            )}
                        </View>
                    </View>
                }
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.textInput, { height: 160, textAlignVertical: "top", paddingTop: 10, paddingBottom: 10 }]}
                        value={contractor.userNotesOnboardingStatus}
                        placeholder="Enter notes"
                        onChangeText={(text) => setContractor({ ...contractor, userNotesOnboardingStatus: text })}
                        autoCapitalize="sentences"
                        multiline={true}
                    />
                </View>
            </ScrollView>
            <View style={styles.buttonsContainer}>
                {!loading
                    ? <>
                        <ButtonOneUnfilled
                            title="Cancel"
                            onPress={() => {
                                navigation.goBack();
                            }}
                        />
                        <ButtonOne
                            title="Save"
                            disabled={loading || !(contractor.userId?.length === 10)}
                            style={styles.saveButton}
                            onPress={() => {
                                setLoading(true);
                                const saveContractor = async () => {
                                    try {
                                        const result = await updateContractor(contractor)
                                        if (result.error) {
                                            setLoading(false);
                                            alert(result.error);
                                        } else {
                                            setLoading(false);
                                            navigation.goBack();
                                            alert("Contractor updated successfully");
                                        }
                                    } catch (error) {
                                        setLoading(false);
                                        alert(error);
                                    }
                                }
                                saveContractor();
                            }}
                        />
                    </>
                    : <ActivityIndicator size="large" color={colors.primary} />
                }
            </View>
        </View>
    )
}

export default CreateContractorScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topContainer: {
        flex: 1,
        padding: spacings.large,
        backgroundColor: colors.backgroundGreen,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: spacings.large,
        backgroundColor: colors.surfaceYellow,
        marginTop: spacings.small,
    },
    heading: {
        ...textStyles.heading2,
    },
    inputContainer: {
        padding: spacings.large,
        paddingBottom: 0,
        backgroundColor: colors.surface,
    },
    label: {
        ...textStyles.caption,
        fontWeight: 'bold',
    },
    labelTag: {
        ...textStyles.caption,
        color: colors.error,
    },
    labelValue: {
        ...textStyles.body,
        margin: spacings.small,
    },
    textInput: {
        ...textInputStyles.small,
        margin: spacings.small,
        marginBottom: spacings.large,
    },
    radioButtonsContainerVertical: {
        margin: spacings.small,
    },
    radioButtonsContainerWrapped: {
        margin: spacings.small,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    radioButtonsWrapped: {
        marginRight: spacings.small,
    },
    radioButtonsContainerHorizontal: {
        margin: spacings.small,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    radioButtonsHorizontal: {
        flex: 1,
        marginRight: spacings.small,
        paddingRight: spacings.large,
    },
    verificationTagContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginRight: spacings.small,
        backgroundColor: colors.surface,
        paddingVertical: spacings.small / 2,
        paddingHorizontal: spacings.medium,
        borderRadius: 16,

    },
    verificationTag: {
        ...textStyles.caption,
        fontWeight: 'bold',
    },
    nameAndTagContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    techProfileContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacings.medium,
        marginBottom: spacings.small,
        backgroundColor: colors.borderDisabled,
    },
    sectionHeading: {
        ...textStyles.heading2,
        marginRight: spacings.small,
    },
    techProfilesContainer: {
        padding: spacings.large,
        paddingBottom: 0,
        backgroundColor: colors.surface,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: spacings.large,
        backgroundColor: colors.surface,
    },
    saveButton: {
        flex: 1,
        marginLeft: spacings.large,
    },
    checkBoxesContainer: {
        margin: spacings.medium,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    checkBoxes: {
        marginRight: spacings.small,
    },
    profileBoxesContainer: {
        margin: spacings.medium,
    },
    dateText: {
        ...textStyles.body,
        marginBottom: spacings.large,
    },
    datePickerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.surface,
        padding: spacings.large,
    },
    switchRMIconContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: spacings.large,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modal: {
        width: '80%',
        backgroundColor: colors.surface,
        padding: spacings.large,
        borderRadius: 16,
    },
    modalTitle: {
        ...textStyles.heading2,
        marginBottom: spacings.large,
        marginTop: spacings.small,
    },
    modalCancelButton: {
        width: '100%',
        marginTop: spacings.medium,
    },
    topButtonsContainer: {
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

})