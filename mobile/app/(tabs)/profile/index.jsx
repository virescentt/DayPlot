import { View, ScrollView, Text, StyleSheet, Pressable } from 'react-native';
import { pxToPt } from '../../../utils/scale.js';
import { router } from 'expo-router';
import font from '../../../constants/typography.js';
import Header from '../../../components/ui/Header.jsx';
import Footer from '../../../components/ui/Footer.jsx';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import ProfileSettingBtn from '../../../components/ui/ProfileSettingBtn.jsx';
import Language from './language.jsx';

export default function Profile() {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={{flex: 1, width: '100%', backgroundColor: '#0d283d'}}>
        <View style={{paddingVertical: 10, paddingHorizontal: 5, flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
          <Ionicons name="person-circle" size={120} color="#a7bdd2"/>
          <View style={{ flexDirection: 'column', gap: 5, marginTop: 10, }}>
            <Pressable
              style={{flexDirection: 'row', alignItems: 'center', gap: 5}}
            >
              <Text style={{fontFamily: font.Mbold, fontSize: pxToPt(80), color: '#fff'}}>Username</Text>
              <Ionicons name="pencil" size={12} color="#fff"/>
            </Pressable>
            <Pressable
              style={{flexDirection: 'row', alignItems: 'center', gap: 3}}
            >
              <Text style={{fontFamily: font.Mregular, fontSize: pxToPt(40), color: '#fff'}}>zz***zz@gmail.com</Text>
              {/* <Ionicons name="pencil" size={10} color="#fff"/> */}
            </Pressable>
          </View>
        </View>
        
        <View style={{flexDirection: 'column', width: '100%', alignItems: 'center'}}>
          <ProfileSettingBtn
          target={'profile/language'}
          iconName={'language'}
          btnName={'Language'}
          />
          <ProfileSettingBtn 
          target={'profile/time'}
          iconName={'timeLimits'} 
          btnName={'Time Limits'}
          />
          <ProfileSettingBtn
          target={'profile/faq'}
          iconName={'faq'} 
          btnName={'FAQ'}
          />
          <ProfileSettingBtn 
          target={'profile/privacy'}
          iconName={'privacySafety'} 
          btnName={'Privacy & Safety'}
          />
          <ProfileSettingBtn 
          target={'profile/legal'}
          iconName={'legalPolicies'} 
          btnName={'Legal & Policies'}
          />
          <ProfileSettingBtn 
          target={'profile/report'}
          iconName={'reportProblem'} 
          btnName={'Report a Problem'}
          />
          <ProfileSettingBtn
          iconName={'logOut'}
          btnName={'Log out'}
          />

        </View>
      </ScrollView>
      {/* <Footer /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center', 
    justifyContent: 'space-between'
  }
}
) 