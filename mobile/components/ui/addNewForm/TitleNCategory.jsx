import { StyleSheet, TextInput } from "react-native";
import CategorySelect from "../CategorySelect";
import { useContext } from "react";
import { AddNewContext } from "../../../context/AddNewContext";
import font from "../../../constants/typography";

export default function TitleNCategory() {
    const {common, setCommon} = useContext(AddNewContext);
    
    return (
        <>
        {/* Title input */}
        <TextInput
            style={styles.input}
            placeholder="Title"
            placeholderTextColor="#394c6080"
            value={common.title}
            onChangeText={(text) => setCommon(prev => ({ ...prev, title: text }))}
            />
        <CategorySelect />
        </>
    )
};

const styles = StyleSheet.create({
    input: {
        width: '90%',
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
        fontFamily: font.Mregular,
        letterSpacing: 1.4,
        fontSize: 20,
        color: '#394c60',
    },
})