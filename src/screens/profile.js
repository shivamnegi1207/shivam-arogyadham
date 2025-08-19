import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { DashboardStyle } from "../styles/dashboard";
import { Context as AuthContext } from '../context/AuthContext';
import { useContext } from "react";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const ProfilePage = ({ navigation }) => {
  const { state, logout } = useContext(AuthContext);

  const handleSignOut = () => {
    logout(navigation);
  }

  return (
    <View style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={DashboardStyle.wrapper}>
        <View style={{ paddingHorizontal: 30, paddingTop: 65 }}>
          <Image
            source={require('../../assets/images/logo.png')}
            resizeMode="contain"
            style={DashboardStyle.logo}
          />
          <Text style={DashboardStyle.subHeading}>
            Welcome {state.fullName || ''}
          </Text>
          <View style={{flexDirection:'row',gap:20,paddingHorizontal:20}}>
            <Text style={{fontSize:16,textTransform:'uppercase',fontWeight:'500',flex:1}}>नाम</Text>
            <Text style={{fontSize:15,textTransform:'capitalize',fontWeight:'300',flex:1}}>{state.fullName || ''}</Text>
          </View>
          <View style={{flexDirection:'row',gap:20,paddingHorizontal:20}}>
            <Text style={{fontSize:16,textTransform:'uppercase',fontWeight:'500',flex:1}}>मोबाइल नंबर</Text>
            <Text style={{fontSize:15,textTransform:'capitalize',fontWeight:'300',flex:1}}>{state.phoneNumber || ''}</Text>
          </View>
          <View style={{flexDirection:'row',gap:20,paddingHorizontal:20}}>
            <Text style={{fontSize:16,textTransform:'uppercase',fontWeight:'500',flex:1}}>पंजीकरण संख्या</Text>
            <Text style={{fontSize:15,textTransform:'capitalize',fontWeight:'300',flex:1}}>{state.registrationNumber || ''}</Text>
          </View>
        </View>
      </View>
    </ScrollView>

    {/* Sticky Footer */}
    <View style={{ flexDirection: 'row', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <Pressable style={{ flex: 1, alignItems: 'center', padding: 10 }}>
        <FontAwesome6 name="user-gear" size={35} color="#01c43d" style={{ width: 40 }} />
      </Pressable>
      <Pressable style={{ flex: 1, alignItems: 'center', padding: 10 }} onPress={()=>navigation.navigate('Dashboard')}>
        <FontAwesome6 name="music" size={28} color="#10331b" style={{ width: 30 }} />
      </Pressable>
      <Pressable style={{ flex: 1, alignItems: 'center', padding: 10 }} onPress={handleSignOut}>
        <MaterialIcons name="logout" size={28} color="#10331b" style={{ width: 30 }} />
      </Pressable>
    </View>
  </View>
  );
};

export default ProfilePage;
