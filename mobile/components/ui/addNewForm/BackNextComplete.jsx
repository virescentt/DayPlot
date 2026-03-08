import { Pressable, StyleSheet, Text, View } from "react-native";
import { useContext } from "react";
import { AddNewContext } from "../../../context/AddNewContext";
import font from "../../../constants/typography";
import { handleBack, handleComplete } from "../../../utils/addNew";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../../../context/AuthContext";

export default function BackNextComplete({ rightBtn = "next" }) {
    const { isChanged, utils, common, newTask,template, createTask, resetForm, setUtils } = useContext(AddNewContext);
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
            <Text style={styles.textBtn}>BACK</Text>
        </Pressable>

        {/* NEXT || COMPLETE button */}
        {rightBtn === 'next'
            ? (<Pressable
                style={[
                styles.button,
                !common.title && { opacity: 0.5 }  
                ]}
                disabled={!common.title}
                onPress={() => setUtils(prev => ({ ...prev, step: prev.step + 1 }))}
              >
                <Text style={styles.textBtn}>NEXT</Text>
              </Pressable>)
            : (<Pressable
                style={[styles.button]}
                onPress={ async () => handleComplete(common, newTask, template, createTask, token, setUtils, resetForm) }
                >
                <MaterialIcons name="done" size={50} color={"#394c60"} />
              </Pressable>)
        }

    </View>
    )
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flex: 1, 
    width: '100%', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  button: {
    alignSelf: 'flex-end',
  },
  textBtn: {
    color: '#fff',
    fontSize: 30,
    letterSpacing: 1.4,
    color: '#3c6674',
    fontFamily: font.Mregular,
  },
})
