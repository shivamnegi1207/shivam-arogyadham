import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { DashboardStyle } from "../styles/dashboard";
import { Context as AuthContext } from '../context/AuthContext';
import { useContext, useEffect, useState } from "react";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { axiosAuth } from "../config/axios";
import { Modal, Portal, Button } from "react-native-paper";

const ExercisePage = ({ navigation }) => {
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
              व्यायाम योजना
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

            {/* Preferred Exercises */}
            {consultationData && consultationData.preferedExercises && (
              <View style={{backgroundColor:'white',padding:20,borderRadius:10,marginBottom:20}}>
                <Text style={{fontSize:18,fontWeight:'bold',marginBottom:15,color:'#01c43d'}}>सुझाए गए व्यायाम</Text>
                {consultationData.preferedExercises.map((exercise, index) => (
                  <View key={index} style={{marginBottom:15,padding:15,backgroundColor:'#f8f9fa',borderRadius:8}}>
                    <Text style={{fontSize:16,fontWeight:'bold',color:'#2D2D2D',marginBottom:5}}>
                      {String(exercise.exercise_hi_name || exercise.exercise_name || 'व्यायाम')}
                    </Text>
                    <Text style={{fontSize:14,color:'#5F5F5F',marginBottom:3}}>
                      अवधि: {String(exercise.duration || 'N/A')} मिनट
                    </Text>
                    <Text style={{fontSize:14,color:'#5F5F5F',marginBottom:3}}>
                      दोहराव: {String(exercise.repetitions || 'N/A')}
                    </Text>
                    {exercise.description && (
                      <Text style={{fontSize:13,color:'#5F5F5F',marginTop:5,lineHeight:18}}>
                        विवरण: {String(exercise.description)}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Exercise Instructions */}
            {consultationData && consultationData.instructions && consultationData.instructions.exercise_instruction && (
              <View style={{backgroundColor:'white',padding:20,borderRadius:10,marginBottom:20}}>
                <Text style={{fontSize:18,fontWeight:'bold',marginBottom:15,color:'#01c43d'}}>व्यायाम निर्देश</Text>
                {consultationData.instructions.exercise_instruction.map((instruction, index) => (
                  <Text key={index} style={{fontSize:14,color:'#2D2D2D',marginBottom:8,lineHeight:20}}>
                    • {String(instruction)}
                  </Text>
                ))}
              </View>
            )}

            {/* General Exercise Tips */}
            <View style={{backgroundColor:'white',padding:20,borderRadius:10,marginBottom:20}}>
              <Text style={{fontSize:18,fontWeight:'bold',marginBottom:15,color:'#01c43d'}}>व्यायाम सुझाव</Text>
              <Text style={{fontSize:14,color:'#2D2D2D',marginBottom:8,lineHeight:20}}>
                • व्यायाम से पहले हमेशा वार्म-अप करें
              </Text>
              <Text style={{fontSize:14,color:'#2D2D2D',marginBottom:8,lineHeight:20}}>
                • व्यायाम के दौरान पर्याप्त पानी पिएं
              </Text>
              <Text style={{fontSize:14,color:'#2D2D2D',marginBottom:8,lineHeight:20}}>
                • यदि दर्द या असुविधा हो तो व्यायाम बंद कर दें
              </Text>
              <Text style={{fontSize:14,color:'#2D2D2D',lineHeight:20}}>
                • नियमित व्यायाम करें लेकिन अधिक न करें
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

export default ExercisePage;