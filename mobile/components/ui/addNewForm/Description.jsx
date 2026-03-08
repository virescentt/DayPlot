import { Text, StyleSheet, TextInput, View } from "react-native";
import { useContext } from "react";
import { AddNewContext } from "../../../context/AddNewContext";
import font from "../../../constants/typography";

export default function Description() {
    const {common, setCommon} = useContext(AddNewContext);
    
    return (
    // DESCRIPTION
    <View style={ styles.descriptionContainer }>
        <Text style={[ styles.title2, { textAlign: 'left' }]}>description</Text>

        <TextInput
            style={styles.descriptionInput}
            placeholder="Add task description..."
            placeholderTextColor="#6b8798"
            multiline
            scrollEnabled
            returnKeyType="done"
            textAlignVertical="top"
            value={common.description || ''}
            onChangeText={text =>
                setCommon(prev => ({ ...prev, description: text }))
            }
        />
    </View>
    )
};

const styles = StyleSheet.create({
    descriptionContainer: {
        width: '90%', 
        marginBottom: 20
    },
    title2: {
        textAlign: 'center',
        color: '#3c6674',
        letterSpacing: 1.4,
        fontFamily: font.Bregular,
        fontSize: 40,
        textTransform: 'uppercase',
    },
    descriptionInput: {
        width: '100%',
        height: 120,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        fontFamily: font.Mregular,
        fontSize: 18,
        letterSpacing: 1.2,
        color: '#394c60',
    },
})

