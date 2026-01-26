import { View, Text, StyleSheet, Pressable } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { pxToPt } from '../../utils/scale.js';
import { SettingsIcons } from '../../constants/icons.js';
import { replace } from "expo-router/build/global-state/routing.js";
import { router } from "expo-router";
import font from "../../constants/typography.js";

export default function ProfileSettingBtn({ target, iconName, btnName }) {
    /**
     * @param iconName - must be one of the listed names in the SettingsIcons dict from constants/icons.js
     * @param target - name of a file to which it should redirect (f.ex. 'language')
     */
  return (
    <View style={styles.container}>
        {btnName.toLowerCase() !== 'log out'
        ?   <Pressable
            style={styles.btn}
            onPress={() => router.push(target)}>
                {SettingsIcons[iconName]}
                <Text style={styles.text}>{btnName}</Text>
                <Ionicons name="chevron-forward" size={24} color="#3f6884" />
            </Pressable>
        :   <Pressable
            style={[styles.btn, {justifyContent: 'center', gap: 10, backgroundColor: '#e1eaf3'}]}
            onPress={() => router.replace('/login')}>
                {SettingsIcons[iconName]}
                <Text style={[styles.text, {color: '#0d283d', fontFamily: font.Mbold}]}>{btnName}</Text>
            </Pressable>
        }
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
        width: '90%',
        marginBottom: 15,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 10,
        gap: 12,
        borderWidth: 1,
        borderColor: '#a7bdd2',
        backgroundColor: '#a7bdd2',
        borderRadius: 20,
    },
    text: {
        fontSize: pxToPt(60),
        fontFamily: font.Mregular,
        color: '#fff',
    }

})