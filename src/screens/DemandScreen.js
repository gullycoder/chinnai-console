import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DemandScreen = () => {
    return (
        <View style={styles.container} >
            <Text style={styles.text}>
                Coming soon!
            </Text>
        </View>
    )
}

export default DemandScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 50,
    },

})