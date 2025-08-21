import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { DashboardStyle } from "../styles/dashboard";
import { Context as AuthContext } from '../context/AuthContext';
import { useContext, useEffect, useState } from "react";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { axiosLogin } from "../config/axios";
import { Modal, Portal, Button } from "react-native-paper";

const ProfilePage = ({ navigation }) => {
  const { state, logout } = useContext(AuthContext);
  const [consultationDates, setConsultationDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [consultationData, setConsultationData] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getConsultationDates = async () => {
    try {
      const response = await axiosLogin.get('/getPatientAllConsultationDates');
      if (response.data && response.data.allDates) {
        setConsultationDates(response.data.allDates);
      }
    } catch (error) {
      console.warn(error.message || "Error fetching consultation dates");
    }
  };

  const getConsultationData = async (date) => {
    setLoading(true);
    try {
      const response = await axiosLogin.get(`/getPatientDetailByDate/${date}`);
      if (response.data && response.data.data) {
        setConsultationData(response.data.data);
        setSelectedDate(date);
      }
    } catch (error) {
      console.warn(error.message || "Error fetching consultation data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConsultationDates();
  }, []);

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
              प्रोफाइल
            </Text>

            {/* User Information */}
            <View style={{backgroundColor:'white',padding:20,borderRadius:10,marginBottom:20}}>
              <Text style={{fontSize:18,fontWeight:'bold',marginBottom:15,color:'#01c43d'}}>उपयोगकर्ता जानकारी</Text>
              <Text style={{fontSize:16,color:'#2D2D2D',marginBottom:8}}>
                नाम: {state.fullName || 'N/A'}
              </Text>
              <Text style={{fontSize:16,color:'#2D2D2D',marginBottom:8}}>
                भूमिका: {state.role || 'N/A'}
              </Text>
              <Text style={{fontSize:16,color:'#2D2D2D'}}>
                फोन नंबर: {state.phoneNumber || 'N/A'}
              </Text>
            </View>

            {/* Contact Information */}
            <View style={{backgroundColor:'white',padding:20,borderRadius:10,marginBottom:20}}>
              <Text style={{fontSize:18,fontWeight:'bold',marginBottom:15,color:'#01c43d'}}>संपर्क जानकारी</Text>
              <Text style={{fontSize:14,color:'#2D2D2D',marginBottom:8,fontWeight:'500'}}>पता:</Text>
              <Text style={{fontSize:14,color:'#5F5F5F',marginBottom:12,lineHeight:20}}>
                Jadi Buti Farms, Kolhupani, Uttarakhand 248007
              </Text>
              
              <Text style={{fontSize:14,color:'#2D2D2D',marginBottom:8,fontWeight:'500'}}>ईमेल:</Text>
              <Text style={{fontSize:14,color:'#5F5F5F',marginBottom:12}}>
                info@arogyapath.org
              </Text>
              
              <Text style={{fontSize:14,color:'#2D2D2D',marginBottom:8,fontWeight:'500'}}>समय:</Text>
              <Text style={{fontSize:14,color:'#5F5F5F'}}>
                सोमवार से रविवार: सुबह 9 बजे से शाम 4 बजे तक
              </Text>
            </View>

            {/* Date Selection for Consultation History */}
            <View style={{backgroundColor:'white',padding:20,borderRadius:10,marginBottom:20}}>
              <Text style={{fontSize:18,fontWeight:'bold',marginBottom:15,color:'#01c43d'}}>परामर्श इतिहास</Text>
              <Pressable 
                style={{backgroundColor:'#01c43d',padding:10,borderRadius:5,alignItems:'center'}}
                onPress={() => setShowDateModal(true)}
              >
                <Text style={{color:'white',fontWeight:'bold'}}>
                  {selectedDate ? selectedDate : 'तिथि चुनें'}
                </Text>
              </Pressable>
            </View>

            {/* Payment Details */}
            {consultationData && consultationData.payment_details && (
              <View style={{backgroundColor:'white',padding:20,borderRadius:10,marginBottom:20}}>
                <Text style={{fontSize:18,fontWeight:'bold',marginBottom:15,color:'#01c43d'}}>भुगतान विवरण</Text>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:8}}>
                  <Text style={{fontSize:14,color:'#2D2D2D'}}>पिछला बैलेंस:</Text>
                  <Text style={{fontSize:14,color:'#5F5F5F'}}>₹{consultationData.payment_details.prev_balance || 0}</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:8}}>
                  <Text style={{fontSize:14,color:'#2D2D2D'}}>मैप राशि:</Text>
                  <Text style={{fontSize:14,color:'#5F5F5F'}}>₹{consultationData.payment_details.map_amount || 0}</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:8}}>
                  <Text style={{fontSize:14,color:'#2D2D2D'}}>वास्तविक राशि:</Text>
                  <Text style={{fontSize:14,color:'#5F5F5F'}}>₹{consultationData.payment_details.actual_amount || 0}</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                  <Text style={{fontSize:14,color:'#2D2D2D'}}>छूट:</Text>
                  <Text style={{fontSize:14,color:'#01c43d'}}>₹{consultationData.payment_details.discount || 0}</Text>
                </View>
              </View>
            )}

            {/* Logout Button */}
            <Pressable 
              style={{
                backgroundColor:'#dc3545',
                padding:15,
                borderRadius:10,
                alignItems:'center',
                marginBottom:20
              }}
              onPress={handleSignOut}
            >
              <Text style={{color:'white',fontSize:16,fontWeight:'bold'}}>
                लॉग आउट
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <View style={{ flexDirection: 'row', backgroundColor: 'white', elevation: 5 }}>
        <Pressable style={{ flex: 1, alignItems: 'center', padding: 10 }}>
          <FontAwesome6 name="user-gear" size={30} color="#01c43d" style={{ width: 40 }} />
        </Pressable>
        <Pressable style={{ flex: 1, alignItems: 'center', padding: 10 }} onPress={()=>navigation.navigate('Dashboard')}>
          <FontAwesome6 name="music" size={24} color="#10331b" style={{ width: 30 }} />
        </Pressable>
        <Pressable style={{ flex: 1, alignItems: 'center', padding: 10 }} onPress={()=>navigation.navigate('Medicine')}>
          <MaterialCommunityIcons name="pill" size={24} color="#10331b" style={{ width: 30 }} />
        </Pressable>
        <Pressable style={{ flex: 1, alignItems: 'center', padding: 10 }} onPress={()=>navigation.navigate('HealthPlan')}>
          <Ionicons name="fitness" size={24} color="#10331b" style={{ width: 30 }} />
        </Pressable>
      </View>

      {/* Date Selection Modal */}
      <Portal>
        <Modal visible={showDateModal} onDismiss={() => setShowDateModal(false)} contentContainerStyle={{backgroundColor:'white',margin:20,padding:20,borderRadius:10}}>
          <Text style={{fontSize:18,fontWeight:'bold',marginBottom:20,textAlign:'center'}}>परामर्श तिथि चुनें</Text>
          <ScrollView style={{maxHeight:300}}>
            {consultationDates.map((date, index) => (
              <Pressable 
                key={index}
                style={{
                  padding:15,
                  borderRadius:5,
                  backgroundColor: selectedDate === date ? '#01c43d' : '#f0f0f0',
                  marginBottom:10
                }}
                onPress={() => {
                  getConsultationData(date);
                  setShowDateModal(false);
                }}
              >
                <Text style={{
                  textAlign:'center',
                  color: selectedDate === date ? 'white' : '#2D2D2D',
                  fontWeight:'500'
                }}>
                  {date}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <Button onPress={() => setShowDateModal(false)} style={{marginTop:20}}>
            बंद करें
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

export default ProfilePage;