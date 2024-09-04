import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { colors, opacities, spacings, textStyles, textInputStyles, ButtonOne, ButtonTwo, SelectStory, DividerVertical, DividerHorizontal, ButtonTwoUnfilled, iconSizes, ButtonOneUnfilled, RadioButtons, RadioButtonsTemp, UploadPhotoMultiple } from '../context/DesignSystem';
import { MaterialIcons } from '@expo/vector-icons';
import { SupplyContext } from '../context/SupplyContext';
import { UserContext } from '../context/UserContext';


const TechnicalProfileScreen = ({ route, navigation }) => {
    const { title, contractor } = route.params
    const { rules } = React.useContext(UserContext)
    const { technicalProfiles, createOrUpdateTechnicalProfile } = React.useContext(SupplyContext)

    const technicalProfileToEdit = technicalProfiles.find(technicalProfile => (technicalProfile.contractorId === contractor.userId && technicalProfile.tenderType === title))

    const [loading, setLoading] = React.useState(false);

    const [technicalProfile, setTechnicalProfile] = React.useState({
        profileId: technicalProfileToEdit ? technicalProfileToEdit.profileId : title + contractor.userId,
        tenderType: title,
        contractorId: contractor.userId,
        contractorPhone: contractor.phone,
        ...technicalProfileToEdit
    })

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.topContainer}>
                    <View style={styles.statusLeftContainer}>
                        <Text style={styles.sectionHeading}>
                            {title}:
                        </Text>
                        <View style={[styles.statusContainer, {
                            backgroundColor: technicalProfile.verificationStatus === 'Verified' ? colors.surfaceGreen : colors.background
                        }]}>
                            <Text style={[styles.status, {
                                color: technicalProfile.verificationStatus === 'Verified' ? colors.primary : colors.error
                            }]}>
                                {technicalProfile.verificationStatus === 'Verified'
                                    ? 'Verified'
                                    : 'Not Verified'}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(
                                'Change Status',
                                'Are you sure you want to change the verification status of the profile?',
                                [
                                    {
                                        text: 'Cancel',
                                        onPress: () => { },
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Change',
                                        onPress: () => {
                                            setTechnicalProfile({
                                                ...technicalProfile,
                                                verificationStatus: technicalProfile.verificationStatus === 'Verified' ? 'Not Verified' : 'Verified'
                                            })
                                        }
                                    },
                                ],
                                { cancelable: false },
                            );
                        }}
                    >
                        <Text style={styles.changeStatusText}>
                            UPDATE
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.middleContainers}>
                    <View style={styles.statusLeftContainer}>
                        <Text style={styles.sectionHeading}>
                            Running site
                        </Text>
                        <View style={[styles.statusContainer, {
                            backgroundColor: technicalProfile.isRunningSiteVerified === 'Verified' ? colors.surfaceGreen : colors.background
                        }]}>
                            <Text style={[styles.status, {
                                color: technicalProfile.isRunningSiteVerified === 'Verified' ? colors.primary : colors.error
                            }]}>
                                {technicalProfile.isRunningSiteVerified === 'Verified'
                                    ? 'Verified'
                                    : 'Not Verified'}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(
                                'Change Status',
                                'Are you sure you want to change the verification status of the profile?',
                                [
                                    {
                                        text: 'Cancel',
                                        onPress: () => { },
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Change',
                                        onPress: () => {
                                            setTechnicalProfile({
                                                ...technicalProfile,
                                                isRunningSiteVerified: technicalProfile.isRunningSiteVerified === 'Verified' ? 'Not Verified' : 'Verified'
                                            })
                                        }
                                    },
                                ],
                                { cancelable: false },
                            );
                        }}
                    >
                        <Text style={styles.changeStatusText}>
                            UPDATE
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.photosContainer}>
                    <UploadPhotoMultiple
                        onUrlChange={(urlArray) => {
                            setTechnicalProfile({
                                ...technicalProfile,
                                runningSiteUrls: urlArray
                            })
                        }}
                        initialUrls={technicalProfile.runningSiteUrls}
                    />
                </View>
                <DividerHorizontal />



                <View style={styles.middleContainers}>
                    <View style={styles.statusLeftContainer}>
                        <Text style={styles.sectionHeading}>
                            Work Order
                        </Text>
                        <View style={[styles.statusContainer, {
                            backgroundColor: technicalProfile.isWorkOrderVerified === 'Verified' ? colors.surfaceGreen : colors.background
                        }]}>
                            <Text style={[styles.status, {
                                color: technicalProfile.isWorkOrderVerified === 'Verified' ? colors.primary : colors.error
                            }]}>
                                {technicalProfile.isWorkOrderVerified === 'Verified'
                                    ? 'Verified'
                                    : 'Not Verified'}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(
                                'Change Status',
                                'Are you sure you want to change the verification status of the profile?',
                                [
                                    {
                                        text: 'Cancel',
                                        onPress: () => { },
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Change',
                                        onPress: () => {
                                            setTechnicalProfile({
                                                ...technicalProfile,
                                                isWorkOrderVerified: technicalProfile.isWorkOrderVerified === 'Verified' ? 'Not Verified' : 'Verified'
                                            })
                                        }
                                    },
                                ],
                                { cancelable: false },
                            );
                        }}
                    >
                        <Text style={styles.changeStatusText}>
                            UPDATE
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.photosContainer}>
                    <UploadPhotoMultiple
                        onUrlChange={(urlArray) => {
                            setTechnicalProfile({
                                ...technicalProfile,
                                workOrderUrls: urlArray
                            })
                        }}
                        initialUrls={technicalProfile.workOrderUrls}
                    />
                </View>
                <DividerHorizontal />
                <View style={styles.middleContainers}>
                    <View style={styles.statusLeftContainer}>
                        <Text style={styles.sectionHeading}>
                            Running bill
                        </Text>
                        <View style={[styles.statusContainer, {
                            backgroundColor: technicalProfile.isRunningBillVerified === 'Verified' ? colors.surfaceGreen : colors.background
                        }]}>
                            <Text style={[styles.status, {
                                color: technicalProfile.isRunningBillVerified === 'Verified' ? colors.primary : colors.error
                            }]}>
                                {technicalProfile.isRunningBillVerified === 'Verified'
                                    ? 'Verified'
                                    : 'Not Verified'}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(
                                'Change Status',
                                'Are you sure you want to change the verification status of the profile?',
                                [
                                    {
                                        text: 'Cancel',
                                        onPress: () => { },
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Change',
                                        onPress: () => {
                                            setTechnicalProfile({
                                                ...technicalProfile,
                                                isRunningBillVerified: technicalProfile.isRunningBillVerified === 'Verified' ? 'Not Verified' : 'Verified'
                                            })
                                        }
                                    },
                                ],
                                { cancelable: false },
                            );
                        }}
                    >
                        <Text style={styles.changeStatusText}>
                            UPDATE
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.photosContainer}>
                    <UploadPhotoMultiple
                        onUrlChange={(urlArray) => {
                            setTechnicalProfile({
                                ...technicalProfile,
                                runningBillUrls: urlArray
                            })
                        }}
                        initialUrls={technicalProfile.runningBillUrls}
                    />
                </View>
                <DividerHorizontal />
                <View style={styles.middleContainers}>
                    <View style={styles.statusLeftContainer}>
                        <Text style={styles.sectionHeading}>
                            References
                        </Text>
                        <View style={[styles.statusContainer, {
                            backgroundColor: technicalProfile.isReferencesVerified === 'Verified' ? colors.surfaceGreen : colors.background
                        }]}>
                            <Text style={[styles.status, {
                                color: technicalProfile.isReferencesVerified === 'Verified' ? colors.primary : colors.error
                            }]}>
                                {technicalProfile.isReferencesVerified === 'Verified'
                                    ? 'Verified'
                                    : 'Not Verified'}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(
                                'Change Status',
                                'Are you sure you want to change the verification status of the profile?',
                                [
                                    {
                                        text: 'Cancel',
                                        onPress: () => { },
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Change',
                                        onPress: () => {
                                            setTechnicalProfile({
                                                ...technicalProfile,
                                                isReferencesVerified: technicalProfile.isReferencesVerified === 'Verified' ? 'Not Verified' : 'Verified'
                                            })
                                        }
                                    },
                                ],
                                { cancelable: false },
                            );
                        }}
                    >
                        <Text style={styles.changeStatusText}>
                            UPDATE
                        </Text>
                    </TouchableOpacity>
                </View>
                <DividerHorizontal />

                <View style={styles.inputContainer}>
                    <Text style={[styles.label, { marginTop: spacings.small }]}>
                        Project types (complete or running)
                    </Text>
                    <RadioButtons
                        titlesArray={rules.rulesProjectTypes}
                        selected={technicalProfile.projectType}
                        setSelected={(value) => { setTechnicalProfile({ ...technicalProfile, projectType: value }) }}
                        containerStyle={styles.radioButtonsContainerWrapped}
                        style={styles.radioButtonsWrapped}
                    />
                    {title !== "Others"
                        ? <View>
                            <Text style={styles.label}>
                                Work details (complete or running)
                            </Text>
                            <RadioButtons
                                titlesArray={
                                    title === "Barbending"
                                        ? rules.rulesTenderDetailsBarbending
                                        : title === "Shuttering"
                                            ? rules.rulesTenderDetailsShuttering
                                            : title === "Masonry"
                                                ? rules.rulesTenderDetailsMasonry
                                                : rules.rulesTenderDetailsPlastering


                                }
                                selected={technicalProfile.tenderDetails}
                                setSelected={(value) => { setTechnicalProfile({ ...technicalProfile, tenderDetails: value }) }}
                                containerStyle={styles.radioButtonsContainerWrapped}
                                style={styles.radioButtonsWrapped}
                            />
                        </View>
                        : <View>
                            <Text style={styles.label}>
                                Add work type
                            </Text>
                            <RadioButtons
                                titlesArray={rules.rulesTenderTypes}
                                selected={technicalProfile.tenderDetails}
                                setSelected={(value) => { setTechnicalProfile({ ...technicalProfile, tenderDetails: value }) }}
                                containerStyle={styles.radioButtonsContainerWrapped}
                                style={styles.radioButtonsWrapped}
                            />
                        </View>
                    }
                    <Text style={styles.label}>
                        Labor or Material
                    </Text>
                    <RadioButtons
                        titlesArray={["Labor Only", "With Material Only", "Both"]}
                        selected={technicalProfile.laborOrMaterial}
                        setSelected={(value) => { setTechnicalProfile({ ...technicalProfile, laborOrMaterial: value }) }}
                        containerStyle={styles.radioButtonsContainerWrapped}
                        style={styles.radioButtonsWrapped}
                    />

                    <Text style={styles.label}>
                        Direct labor or subcontracting?
                    </Text>
                    <RadioButtons
                        titlesArray={['Direct Labor Only', 'Subcontracting Only', 'Both']}
                        selected={technicalProfile.directOrSubcontracting}
                        setSelected={(value) => { setTechnicalProfile({ ...technicalProfile, directOrSubcontracting: value }) }}
                        containerStyle={styles.radioButtonsContainerWrapped}
                        style={styles.radioButtonsWrapped}
                    />
                    {technicalProfile.directOrSubcontracting === 'Subcontracting' &&
                        <View>
                            <Text style={styles.label}>
                                Subcontractor Name
                            </Text>
                            <TextInput
                                style={styles.textInput}
                                autoCapitalize="words"
                                value={technicalProfile.subContractorName}
                                onChangeText={(text) => setTechnicalProfile({ ...technicalProfile, subContractorName: text })}
                            />
                            <Text style={styles.label}>
                                Subcontractor Phone
                            </Text>
                            <TextInput
                                style={styles.textInput}
                                value={technicalProfile.subContractorPhone}
                                keyboardType='numeric'
                                maxLength={10}
                                onChangeText={(text) => setTechnicalProfile({ ...technicalProfile, subContractorPhone: text })}
                            />
                        </View>}


                    <Text style={styles.label}>
                        Total manpower (claimed)
                    </Text>
                    <RadioButtons
                        titlesArray={rules.rulesManpower}
                        selected={technicalProfile.totalManpowerClaimed}
                        setSelected={(value) => { setTechnicalProfile({ ...technicalProfile, totalManpowerClaimed: value }) }}
                        containerStyle={styles.radioButtonsContainerWrapped}
                        style={styles.radioButtonsWrapped}
                    />
                    <Text style={styles.label}>
                        Total manpower (verified)
                    </Text>
                    <RadioButtons
                        titlesArray={rules.rulesManpower}
                        selected={technicalProfile.totalManpowerVerified}
                        setSelected={(value) => { setTechnicalProfile({ ...technicalProfile, totalManpowerVerified: value }) }}
                        containerStyle={styles.radioButtonsContainerWrapped}
                        style={styles.radioButtonsWrapped}
                    />
                    <Text style={styles.label}>
                        Biggest tender size (claimed)
                    </Text>
                    <RadioButtons
                        titlesArray={rules.rulesAnnualTurnover}
                        selected={technicalProfile.biggestTenderSizeClaimed}
                        setSelected={(value) => { setTechnicalProfile({ ...technicalProfile, biggestTenderSizeClaimed: value }) }}
                        containerStyle={styles.radioButtonsContainerWrapped}
                        style={styles.radioButtonsWrapped}
                    />
                    <Text style={styles.label}>
                        Biggest tender size (verified)
                    </Text>
                    <RadioButtons
                        titlesArray={rules.rulesAnnualTurnover}
                        selected={technicalProfile.biggestTenderSizeVerified}
                        setSelected={(value) => { setTechnicalProfile({ ...technicalProfile, biggestTenderSizeVerified: value }) }}
                        containerStyle={styles.radioButtonsContainerWrapped}
                        style={styles.radioButtonsWrapped}
                    />
                    {/* <Text style={styles.label}>
                        Notes for technical profile
                    </Text>
                    <TextInput
                        style={[styles.textInput, { height: 100, textAlignVertical: "top", paddingTop: 10, paddingBottom: 10 }]}
                        placeholder="Enter notes"
                        onChangeText={(value) => { setTechnicalProfile({ ...technicalProfile, notes: value }) }}
                        autoCapitalize="sentences"
                        multiline={true}
                    /> */}
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
                            disabled={loading}
                            style={styles.saveButton}
                            onPress={() => {
                                setLoading(true)
                                const saveTechnicalProfile = async () => {
                                    // create or update technical profile
                                    const result = await createOrUpdateTechnicalProfile(technicalProfile);
                                    if (result.error) {
                                        setLoading(false)
                                        alert(result.error);
                                    } else {
                                        setLoading(false)
                                        navigation.goBack();
                                        alert("Technical profile saved successfully");
                                    }
                                }
                                saveTechnicalProfile();
                            }}
                        />
                    </>
                    : <ActivityIndicator size="large" color={colors.primary} />
                }
            </View>
        </View>
    )
}

export default TechnicalProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    inputContainer: {
        padding: spacings.large,
        backgroundColor: colors.surface,
        elevation: 2,
    },
    label: {
        ...textStyles.caption,
        fontWeight: 'bold',
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
    textInput: {
        ...textInputStyles.small,
        margin: spacings.small,
        marginBottom: spacings.large,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: spacings.large,
        backgroundColor: colors.surface,
        elevation: 2,
    },
    saveButton: {
        flex: 1,
        marginLeft: spacings.large,
    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
        padding: spacings.large,
        backgroundColor: colors.backgroundGreen,
    },
    middleContainers: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
        padding: spacings.large,
        backgroundColor: colors.surface,
    },
    statusContainer: {
        height: spacings.medium * 2,
        borderRadius: spacings.medium * 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacings.medium,
        alignSelf: 'flex-start',
        marginLeft: spacings.small,
    },
    sectionHeading: {
        ...textStyles.body,
        fontWeight: 'bold',
    },
    status: {
        ...textStyles.caption,
        fontWeight: 'bold',
    },
    changeStatusText: {
        ...textStyles.heading2,
        color: colors.primary,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    statusLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    photosContainer: {
        padding: spacings.large,
        backgroundColor: colors.surface,
        paddingTop: 0,
    },

})