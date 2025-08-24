import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { DashboardStyle } from "../styles/dashboard";
import { Context as AuthContext } from '../context/AuthContext';
import { useContext, useEffect, useState } from "react";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { axiosAuth } from "../config/axios";
import { Modal, Portal, Button } from "react-native-paper";

const TimeTablePage = ({ navigation }) => {
  const { state } = useContext(AuthContext);
  const [consultationDates, setConsultationDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [consultationData, setConsultationData] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getConsultationDates = async () => {
    try {
      const response = await axios.get('/getPatientAllConsultationDates');
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
      const response = await axios.get(`/getPatientDetailByDate/${date}`);
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

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

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
              दैनिक समय सारणी
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

            {/* Time Table */}
            {consultationData && consultationData.time_table && consultationData.time_table.length > 0 && (
              <View style={{backgroundColor:'white',padding:20,borderRadius:10,marginBottom:20}}>
                <Text style={{fontSize:18,fontWeight:'bold',marginBottom:15,color:'#01c43d'}}>दैनिक दिनचर्या</Text>
                {consultationData.time_table.map((schedule, index) => (
                  <View key={index} style={{marginBottom:15,padding:15,backgroundColor:'#f8f9fa',borderRadius:8}}>
                    <Text style={{fontSize:16,fontWeight:'bold',color:'#2D2D2D',marginBottom:5}}>
                      {String(schedule.description || 'गतिविधि')}
                    </Text>
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:5}}>
                      <Text style={{fontSize:14,color:'#5F5F5F'}}>
                        शुरुआत का समय: {String(formatTime(schedule.startTime))}
                      </Text>
                      {schedule.endTime && (
                        <Text style={{fontSize:14,color:'#5F5F5F'}}>
                          समाप्ति का समय: {String(formatTime(schedule.endTime))}
                        </Text>
                      )}
                    </View>
                    {schedule.medicines && schedule.medicines.length > 0 && (
                      <View style={{marginTop:10}}>
                        <Text style={{fontSize:14,fontWeight:'500',color:'#01c43d',marginBottom:5}}>
                          दवाएं:
                        </Text>
                        {schedule.medicines.map((medicine, medIndex) => (
                          <Text key={medIndex} style={{fontSize:13,color:'#5F5F5F',marginLeft:10}}>
                            • {String(medicine.label || medicine.value || 'दवा')}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* General Time Table Tips */}
            <View style={{backgroundColor:'white',padding:20,borderRadius:10,marginBottom:20}}>
              <Text style={{fontSize:18,fontWeight:'bold',marginBottom:15,color:'#01c43d'}}>दिनचर्या सुझाव</Text>
              <Text style={{fontSize:14,color:'#2D2D2D',marginBottom:8,lineHeight:20}}>
                • नियमित समय पर सोएं और जागें
              </Text>
              <Text style={{fontSize:14,color:'#2D2D2D',marginBottom:8,lineHeight:20}}>
                • भोजन का समय निर्धारित रखें
              </Text>
              <Text style={{fontSize:14,color:'#2D2D2D',marginBottom:8,lineHeight:20}}>
                • दवाओं का समय याद रखें
              </Text>
              <Text style={{fontSize:14,color:'#2D2D2D',lineHeight:20}}>
                • व्यायाम के लिए समय निकालें
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
        <Pressable style={{ flex: 1, alignItems: 'center', padding: 10 }} onPress={()=>navigation.navigate('HealthPlan')}>
          <Ionicons name="fitness" size={24} color="#10331b" style={{ width: 30 }} />
        </Pressable>
        <Pressable style={{ flex: 1, alignItems: 'center', padding: 10 }} onPress={()=>navigation.navigate('Medicine')}>
          <MaterialCommunityIcons name="pill" size={24} color="#10331b" style={{ width: 30 }} />
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

export default TimeTablePage;