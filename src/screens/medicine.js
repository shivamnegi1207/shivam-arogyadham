import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { DashboardStyle } from "../styles/dashboard";
import { Context as AuthContext } from '../context/AuthContext';
import { useContext, useEffect, useState } from "react";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { axiosAuth } from "../config/axios";
import { Modal, Portal, Button } from "react-native-paper";

const MedicinePage = ({ navigation }) => {
  const { state } = useContext(AuthContext);
  const [consultationDates, setConsultationDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [consultationData, setConsultationData] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getConsultationDates = async () => {
    try {
      const response = await axiosAuth.get('/getPatientAllConsultationDates');
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
      const response = await axiosAuth.get(`/getPatientDetailByDate/${date}`);
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
              दवाई विवरण
            </Text>

            {/* Date Selection */}
            <View style={{backgroundColor:'white',padding:20,borderRadius:10,marginBottom:20}}>
              <Text style={{fontSize:16,fontWeight:'bold',marginBottom:15,color:'#01c43d'}}>तिथि चुनें</Text>
              <Pressable 
                style={{backgroundColor:'#01c43d',padding:10,borderRadius:5,alignItems:'center'}}
                onPress={() => setShowDateModal(true)}
              >
                <Text style={{color:'white',fontWeight:'bold'}}>
                  {String(selectedDate || 'तिथि चुनें')}
                </Text>
              </Pressable>
            </View>

            {/* Medicine Details */}
            {consultationData && consultationData.prescribedMedicine && (
              <View style={{backgroundColor:'white',padding:20,borderRadius:10,marginBottom:20}}>
                <Text style={{fontSize:18,fontWeight:'bold',marginBottom:15,color:'#01c43d'}}>निर्धारित दवाएं</Text>
                {consultationData.prescribedMedicine.map((medicine, index) => (
                  <View key={index} style={{marginBottom:15,padding:15,backgroundColor:'#f8f9fa',borderRadius:8}}>
                    <Text style={{fontSize:16,fontWeight:'bold',color:'#2D2D2D',marginBottom:5}}>
                      {String(medicine.medicine_hi_name || medicine.medicine_name || 'दवा का नाम')}
                    </Text>
                    <Text style={{fontSize:14,color:'#5F5F5F',marginBottom:5}}>
                      मात्रा: {String(medicine.quantity || 'N/A')}
                    </Text>
                    <Text style={{fontSize:14,color:'#5F5F5F',marginBottom:5}}>
                      क्रम: {String(medicine.In_Take_Sequence || 'N/A')}
                    </Text>
                    <Text style={{fontSize:14,color:'#5F5F5F',marginBottom:5}}>
                      खरीदें: {String(medicine.buy_from || 'N/A')}
                    </Text>
                    {medicine.how_to_take && medicine.how_to_take.length > 0 && (
                      <View style={{marginTop:10}}>
                        <Text style={{fontSize:14,fontWeight:'500',color:'#01c43d',marginBottom:5}}>
                          सेवन विधि:
                        </Text>
                        {medicine.how_to_take.map((instruction, instIndex) => (
                          <View key={instIndex} style={{marginBottom:8,paddingLeft:10}}>
                            <Text style={{fontSize:13,color:'#2D2D2D',fontWeight:'500'}}>
                              • {String(instruction.hi_time_of_take || instruction.time_of_take || '')}
                            </Text>
                            <Text style={{fontSize:12,color:'#5F5F5F',marginLeft:10,lineHeight:16}}>
                              {String(instruction.hi_way_of_taken || instruction.way_of_taken || '')}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Medicine Instructions */}
            {consultationData && consultationData.instructions && consultationData.instructions.medicine_instruction && (
              <View style={{backgroundColor:'white',padding:20,borderRadius:10,marginBottom:20}}>
                <Text style={{fontSize:18,fontWeight:'bold',marginBottom:15,color:'#01c43d'}}>दवा निर्देश</Text>
                {consultationData.instructions.medicine_instruction.map((instruction, index) => (
                  <Text key={index} style={{fontSize:14,color:'#2D2D2D',marginBottom:8,lineHeight:20}}>
                    • {String(instruction)}
                  </Text>
                ))}
              </View>
            )}

            {/* Custom Medicine Instructions */}
            {consultationData && consultationData.medicineDetails && consultationData.medicineDetails.medicine_custom_inst && (
              <View style={{backgroundColor:'white',padding:20,borderRadius:10,marginBottom:20}}>
                <Text style={{fontSize:18,fontWeight:'bold',marginBottom:15,color:'#01c43d'}}>विशेष निर्देश</Text>
                <Text style={{fontSize:14,color:'#2D2D2D',lineHeight:20}}>
                  {String(consultationData.medicineDetails.medicine_custom_inst || '')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <View style={{ flexDirection: 'row', backgroundColor: 'white', elevation: 5 }}>
        <Pressable style={{ flex: 1, alignItems: 'center', padding: 10 }} onPress={()=>navigation.navigate('Profile')}>
          <FontAwesome6 name="user-gear" size={24} color="#10331b" style={{ width: 30 }} />
        </Pressable>
        <Pressable style={{ flex: 1, alignItems: 'center', padding: 10 }} onPress={()=>navigation.navigate('HealthPlan')}>
          <Ionicons name="fitness" size={24} color="#10331b" style={{ width: 30 }} />
        </Pressable>
        <Pressable style={{ flex: 1, alignItems: 'center', padding: 10 }}>
          <MaterialCommunityIcons name="pill" size={30} color="#01c43d" style={{ width: 40 }} />
        </Pressable>
        <Pressable style={{ flex: 1, alignItems: 'center', padding: 10 }} onPress={()=>navigation.navigate('Diet')}>
          <MaterialCommunityIcons name="food-apple" size={24} color="#10331b" style={{ width: 30 }} />
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
                  {String(date)}
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

export default MedicinePage;