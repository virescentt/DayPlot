import { Pressable, StyleSheet, Text, View } from "react-native";
import { useContext } from "react";
import { AddNewContext } from "../../../context/AddNewContext";
import font from "../../../constants/typography";
import { handleBack, handleComplete } from "../../../utils/addNew";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../../../context/AuthContext";

export default function BackNextComplete({ leftBtnText = 'BACK', rightBtn = "next", textSize = 30, textColor = "#3c6674", iconSize = 50, iconColor = "#394c60" }) {
    const { isChanged, utils, common, newTask, template, createTask, resetForm, setUtils } = useContext(AddNewContext);
    const { token } = useContext(AuthContext);

    return (
    // buttons BACK & (NEXT || COMPLETE)
    <View style={ styles.buttonsContainer }>
        
        {/* BACK button */}
        <Pressable
            style={[
            styles.button,
            ]}
            onPress={() => handleBack( isChanged, resetForm, utils.step, setUtils )}
        >
            <Text style={[styles.textBtn, {fontSize: textSize, color: textColor}]}>{leftBtnText}</Text>
        </Pressable>

        {/* NEXT || COMPLETE button */}
        {rightBtn === 'next' ? (
              <Pressable
                style={[
                styles.button,
                !common.title && { opacity: 0.5 }  
                ]}
                disabled={!common.title}
                onPress={() => setUtils(prev => ({ ...prev, step: prev.step + 1 }))}
              >
                <Text style={[styles.textBtn, {fontSize: textSize, color: textColor}]}>NEXT</Text>
              </Pressable>
          ) : rightBtn === 'complete' ? (
              <Pressable
                style={[
                styles.button,
                !template.label && { opacity: 0.1 }  
                ]}
                disabled={!template.label}
                onPress={ async () => handleComplete(common, newTask, template, createTask, token, setUtils, resetForm) }
                >
                <MaterialIcons name="done" size={iconSize} color={iconColor} />
              </Pressable>
          ) : rightBtn === 'none' ? (
              <Pressable
                disabled

                style={[
                styles.button,
                  {opacity: 0}
                ]}
                onPress={ async () => handleComplete(common, newTask, template, createTask, token, setUtils, resetForm) }
                >
                <MaterialIcons name="done" size={iconSize} color={iconColor} />
              </Pressable>
          ) : (console.log('what?'))

        }
    </View>
    )
};

const styles = StyleSheet.create({
  buttonsContainer: {
    width: '100%', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  button: {},
  textBtn: {
    letterSpacing: 1.4,
    fontFamily: font.Mregular,
  },
})
