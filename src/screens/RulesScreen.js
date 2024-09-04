import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'
import { colors, opacities, spacings, textStyles, textInputStyles, ButtonOne, ButtonTwo, SelectStory, DividerVertical, DividerHorizontal, ButtonTwoUnfilled, iconSizes, ButtonOneUnfilled, RadioButtons, RadioButtonsTemp, CheckBoxes } from '../context/DesignSystem';
import { UserContext } from '../context/UserContext'

const RulesScreen = () => {
    const { rules, updateRules } = React.useContext(UserContext)

    const [whatsappMessage1, setWhatsappMessage1] = React.useState(
        rules.rulesWhatsappMessage1 ? rules.rulesWhatsappMessage1 : ''
    )


    return (
        <View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>
                    Whatsapp message 1 for contractors
                </Text>
                <TextInput
                    style={[styles.textInput, { height: "80%", textAlignVertical: "top", paddingTop: 10, paddingBottom: 10 }]}
                    value={whatsappMessage1}
                    placeholder="Enter whatsapp message"
                    onChangeText={setWhatsappMessage1}
                    autoCapitalize="sentences"
                    multiline={true}
                />
                <ButtonOne
                    title="Save"
                    style={{ marginTop: spacings.large }}
                    onPress={() => {
                        const saveRules = async () => {
                            const result = await updateRules('rulesWhatsappMessage1', whatsappMessage1)
                            if (result.error) {
                                alert(result.error)
                            } else {
                                alert('Rules updated')
                            }
                        }
                        saveRules()
                    }}
                />
            </View>
        </View>
    )
}

export default RulesScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
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
    textInput: {
        ...textInputStyles.small,
        margin: spacings.small,
        marginBottom: spacings.large,
    },
})