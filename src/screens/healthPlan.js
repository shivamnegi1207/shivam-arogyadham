import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { DashboardStyle } from "../styles/dashboard";
import { Context as AuthContext } from '../context/AuthContext';
import { useContext } from "react";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const HealthPlanPage = ({ navigation }) => {
  const { state } = useContext(AuthContext);

  const healthPlanOptions = [
    {
      title: 'व्यायाम',
      subtitle: 'दैनिक व्यायाम योजना',
      icon: '🏃‍♂️',
      screen: 'Exercise'
    },
    {
      title: 'आहार',
      subtitle: 'पोषण और आहार योजना',
      icon: '🥗',
      screen: 'Diet'
    },
    {
      title: 'समय सारणी',
      subtitle: 'दैनिक दिनचर्या',
      icon: '⏰',
      screen: 'TimeTable'
    }
  ];

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
              स्वास्थ्य योजना
            </Text>

            <View style={{ marginTop: 20 }}>
              {healthPlanOptions.map((option, index) => (
                <Pressable
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 15,
                    marginBottom: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                    elevation: 3,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                  }}
                  onPress={() => navigation.navigate(option.screen)}
                >
                  <Text style={{ fontSize: 40, marginRight: 20 }}>{option.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: '#2D2D2D',
                      marginBottom: 5
                    }}>
                      {option.title}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: '#5F5F5F'
                    }}>
                      {option.subtitle}
                    </Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={24} color="#01c43d" />
                </Pressable>
              ))}
            </View>

            <View style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 15,
              marginTop: 20,
              alignItems: 'center'
            }}>
              <Text style={{
                fontSize: 16,
                color: '#01c43d',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 10
              }}>
                स्वास्थ्य सुझाव
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#5F5F5F',
                textAlign: 'center',
                lineHeight: 20
              }}>
                नियमित व्यायाम, संतुलित आहार और उचित दिनचर्या का पालन करें। 
                अपने स्वास्थ्य की नियमित जांच कराते रहें।
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <View style={{ flexDirection: 'row', backgroundColor: 'white', elevation: 5 }}>
        <Pressable style={{ flex: 1, alignItems: 'center', padding: 10 }} onPress={()=>navigation.navigate('Profile')}>
          <FontAwesome6 name="user-gear" size={24} color="#10331b" style={{ width: 30 }} />
        </Pressable>
        <Pressable style={{ flex: 1, alignItems: 'center', padding: 10 }}>
          <Ionicons name="fitness" size={30} color="#01c43d" style={{ width: 40 }} />
        </Pressable>
        <Pressable style={{ flex: 1, alignItems: 'center', padding: 10 }} onPress={()=>navigation.navigate('Medicine')}>
          <MaterialCommunityIcons name="pill" size={24} color="#10331b" style={{ width: 30 }} />
        </Pressable>
        <Pressable style={{ flex: 1, alignItems: 'center', padding: 10 }} onPress={()=>navigation.navigate('Diet')}>
          <MaterialCommunityIcons name="food-apple" size={24} color="#10331b" style={{ width: 30 }} />
        </Pressable>
      </View>
    </View>
  );
};

export default HealthPlanPage;