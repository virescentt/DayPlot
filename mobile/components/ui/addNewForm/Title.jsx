import { StyleSheet } from "react-native";
import { useContext } from "react";
import { AddNewContext } from "../../../context/AddNewContext";
import font from "../../../constants/typography";
import InfoLabel from "../InfoLabel";

export default function Title({ info = "Flexible tasks are regular tasks that do not matter to you when they are due.", textStyle, iconColor = '#3c6674' }) {
    const { common } = useContext(AddNewContext);
    
    return (
      // Task type title
      <InfoLabel
        label={common.taskType?.replace('_', ' ') || 'New Task'}
        info={info}
        textStyle={[ styles.title, textStyle ]}
        iconColor={iconColor}
      />
    )
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    selfAlign: 'center',
    color: '#fff',
    // color: '#3c6674',
    letterSpacing: 1.4,
    fontFamily: font.MIregular,
    fontSize: 40,
    marginBottom: 40,
    textTransform: 'uppercase',
  },
})
