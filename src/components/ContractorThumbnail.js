import { StyleSheet, TextInput, Button, TouchableOpacity, Text, View, Alert, ScrollView } from 'react-native'
import React from 'react'
import * as Linking from 'expo-linking';
import { colors, opacities, spacings, textStyles, textInputStyles, ButtonOne, ButtonTwo, SelectStory, DividerVertical, DividerHorizontal, ButtonTwoUnfilled, iconSizes, ButtonOneUnfilled, RadioButtons, RadioButtonsTemp } from '../context/DesignSystem';
import { UserContext } from '../context/UserContext';


const ContractorThumbnail = ({ navigation, contractor }) => {
    const { rules } = React.useContext(UserContext)

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
        <TouchableOpacity
            style={styles.contractorContainer}
            onPress={() => {
                navigation.navigate('Add New Contractor', { contractorId: contractor.userId, title: 'Edit Contractor' })
            }}
        >
            <View style={styles.contractorInfoContainer}>
                <Text style={styles.contractorNameText} >
                    {contractor.userName}
                </Text>
                <Text style={styles.contractorInfoText} >
                    Phone: <Text style={styles.contractorInfoTextBold} >{contractor.phone}</Text>
                </Text>
                {contractor.userPastTenderTypes &&
                    <Text style={styles.contractorInfoText} >
                        Work types (claimed): <Text style={styles.contractorInfoTextBold} >{contractor.userPastTenderTypes?.map(workType => workType).join(', ')}</Text>
                    </Text>
                }
                <Text style={styles.contractorInfoText} >
                    Status: <Text style={styles.contractorInfoTextBold} >{contractor.userOnboardingStatus ? contractor.userOnboardingStatus : "Status not updated"}</Text>
                </Text>
                {contractor.userOnboardingAction &&
                    <>
                        <Text style={styles.contractorInfoText} >
                            Action required: <Text style={styles.contractorInfoTextBoldRed} >
                                {contractor.userOnboardingAction}
                            </Text>
                        </Text>
                        <Text style={styles.contractorInfoText} >
                            Action Date: <Text style={styles.contractorInfoTextBoldRed} >
                                {contractor.userOnboardingActionDate ? contractor.userOnboardingActionDate.toDate().toDateString() : 'Date not selected'}
                            </Text>
                        </Text>
                    </>
                }
                <Text style={styles.contractorInfoText} >
                    Created at: <Text style={styles.contractorInfoTextBold} >{contractor.createdAt ? contractor.createdAt.toDate().toDateString() : 'Not updated'}</Text>
                </Text>
                {contractor.updatedAt && (contractor.updatedAt.toDate().toDateString() !== contractor.createdAt.toDate().toDateString()) &&
                    <Text style={styles.contractorInfoText} >
                        Updated at: <Text style={styles.contractorInfoTextBold} >{contractor.updatedAt ? contractor.updatedAt.toDate().toDateString() : 'Never updated'}</Text>
                    </Text>
                }
                <Text style={styles.contractorInfoText} >
                    {contractor.userNotesOnboardingStatus
                        ? <Text style={styles.contractorInfoText} >
                            Notes: <Text style={styles.contractorInfoTextBold} >{contractor.userNotesOnboardingStatus}</Text>
                        </Text>
                        : <Text style={styles.contractorInfoText} >
                            Notes not updated
                        </Text>
                    }
                </Text>
            </View>
            <View style={styles.buttonsContainer}>
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
        </TouchableOpacity>
    )
}

export default ContractorThumbnail

const styles = StyleSheet.create({
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
    contractorInfoText: {
        ...textStyles.caption,
        color: colors.text,
        marginTop: spacings.small,
    },
    contractorInfoTextBold: {
        ...textStyles.caption,
        color: colors.text,
        fontWeight: 'bold',
    },
    contractorInfoTextBoldRed: {
        ...textStyles.caption,
        color: colors.error,
        fontWeight: 'bold',
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
})