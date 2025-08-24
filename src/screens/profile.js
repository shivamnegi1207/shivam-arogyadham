import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { DashboardStyle } from "../styles/dashboard";
import { Context as AuthContext } from '../context/AuthContext';
import { Context as LanguageContext } from '../context/LanguageContext';
import { useContext, useEffect, useState } from "react";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { axiosAuth } from "../config/axios";
import { Modal, Portal, Button } from "react-native-paper";
import { getTranslation } from "../utils/translations";

const ProfilePage = ({ navigation }) => {
  const { state, logout } = useContext(AuthContext);
  const { state: langState, setLanguage, loadLanguage } = useContext(LanguageContext);
  const [consultationDates, setConsultationDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [consultationData, setConsultationData] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
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
    loadLanguage();
  }, []);

  const handleSignOut = () => {
    logout(navigation);
  }

  const handleLanguageChange = (language) => {
    setLanguage(language);
    setShowLanguageModal(false);
  }

  const t = (key) => getTranslation(langState.language, key);

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
              {t('profile')}
            </Text>

            {/* User Information */}
            <View style={{backgroundColor:'white',padding:20,borderRadius:10,marginBottom:20}}>
              <Text style={{fontSize:18,fontWeight:'bold',marginBottom:15,color:'#01c43d'}}>{t('userInfo')}</Text>
              <Text style={{fontSize:16,color:'#2D2D2D',marginBottom:8}}>
                {t('name')}: {String(state.fullName || 'N/A')}
              </Text>
              <Text style={{fontSize:16,color:'#2D2D2D',marginBottom:8}}>
                {t('role')}: {String(state.role || 'N/A')}
              </Text>
              <Text style={{fontSize:16,color:'#2D2D2D'}}>
                {t('phoneNumber')}: {String(state.phoneNumber || 'N/A')}
              </Text>
            </View>

            {/* Contact Information */}
            <View style={{backgroundColor:'white',padding:20,borderRadius:10,marginBottom:20}}>
              <Text style={{fontSize:18,fontWeight:'bold',marginBottom:15,color:'#01c43d'}}>{t('contactInfo')}</Text>
              <Text style={{fontSize:14,color:'#2D2D2D',marginBottom:8,fontWeight:'500'}}>{t('address')}:</Text>
              <Text style={{fontSize:14,color:'#5F5F5F',marginBottom:12,lineHeight:20}}>
                Jadi Buti Farms, Kolhupani, Uttarakhand 248007
              </Text>
              
              <Text style={{fontSize:14,color:'#2D2D2D',marginBottom:8,fontWeight:'500'}}>{t('email')}:</Text>
              <Text style={{fontSize:14,color:'#5F5F5F',marginBottom:12}}>
                info@arogyapath.org
              </Text>
              
              <Text style={{fontSize:14,color:'#2D2D2D',marginBottom:8,fontWeight:'500'}}>{t('timing')}:</Text>
              <Text style={{fontSize:14,color:'#5F5F5F'}}>
                {langState.language === 'hindi' ? 'सोमवार से रविवार: सुबह 9 बजे से शाम 4 बजे तक' : 'Monday to Sunday: 9am to 4pm'}
              </Text>
            </View>

            {/* Language Settings */}
            <View style={{backgroundColor:'white',padding:20,borderRadius:10,marginBottom:20}}>
              <Text style={{fontSize:18,fontWeight:'bold',marginBottom:15,color:'#01c43d'}}>{t('languageSettings')}</Text>
              <Pressable 
                style={{backgroundColor:'#01c43d',padding:15,borderRadius:8,alignItems:'center'}}
                onPress={() => setShowLanguageModal(true)}
              >
                <Text style={{color:'white',fontWeight:'bold',fontSize:16}}>
                  {t('selectLanguage')}: {t(langState.language)}
                </Text>
              </Pressable>
            </View>

            {/* Date Selection for Consultation History */}
            <View style={{backgroundColor:'white',padding:20,borderRadius:10,marginBottom:20}}>
              <Text style={{fontSize:18,fontWeight:'bold',marginBottom:15,color:'#01c43d'}}>{t('consultationHistory')}</Text>
              <Pressable 
                style={{backgroundColor:'#01c43d',padding:10,borderRadius:5,alignItems:'center'}}
                onPress={() => setShowDateModal(true)}
              >
                <Text style={{color:'white',fontWeight:'bold'}}>
                  {String(selectedDate || t('selectDate'))}
                </Text>
              </Pressable>
            </View>

            {/* Payment Details */}
            {consultationData && consultationData.payment_details && (
              <View style={{backgroundColor:'white',padding:20,borderRadius:10,marginBottom:20}}>
                <Text style={{fontSize:18,fontWeight:'bold',marginBottom:15,color:'#01c43d'}}>{t('paymentDetails')}</Text>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:8}}>
                  <Text style={{fontSize:14,color:'#2D2D2D'}}>{t('previousBalance')}:</Text>
                  <Text style={{fontSize:14,color:'#5F5F5F'}}>₹{String(consultationData.payment_details.prev_balance || 0)}</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:8}}>
                  <Text style={{fontSize:14,color:'#2D2D2D'}}>{t('mapAmount')}:</Text>
                  <Text style={{fontSize:14,color:'#5F5F5F'}}>₹{String(consultationData.payment_details.map_amount || 0)}</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:8}}>
                  <Text style={{fontSize:14,color:'#2D2D2D'}}>{t('actualAmount')}:</Text>
                  <Text style={{fontSize:14,color:'#5F5F5F'}}>₹{String(consultationData.payment_details.actual_amount || 0)}</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                  <Text style={{fontSize:14,color:'#2D2D2D'}}>{t('discount')}:</Text>
                  <Text style={{fontSize:14,color:'#01c43d'}}>₹{String(consultationData.payment_details.discount || 0)}</Text>
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
                {t('logout')}
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
          <Text style={{fontSize:18,fontWeight:'bold',marginBottom:20,textAlign:'center'}}>{t('selectConsultationDate')}</Text>
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
            {t('close')}
          </Button>
        </Modal>
        
        {/* Language Selection Modal */}
        <Modal visible={showLanguageModal} onDismiss={() => setShowLanguageModal(false)} contentContainerStyle={{backgroundColor:'white',margin:20,padding:20,borderRadius:10}}>
          <Text style={{fontSize:18,fontWeight:'bold',marginBottom:20,textAlign:'center'}}>{t('selectLanguage')}</Text>
          
          <Pressable 
            style={{
              padding:15,
              borderRadius:8,
              backgroundColor: langState.language === 'hindi' ? '#01c43d' : '#f0f0f0',
              marginBottom:10
            }}
            onPress={() => handleLanguageChange('hindi')}
          >
            <Text style={{
              textAlign:'center',
              color: langState.language === 'hindi' ? 'white' : '#2D2D2D',
              fontWeight:'500',
              fontSize:16
            }}>
              हिंदी
            </Text>
          </Pressable>
          
          <Pressable 
            style={{
              padding:15,
              borderRadius:8,
              backgroundColor: langState.language === 'english' ? '#01c43d' : '#f0f0f0',
              marginBottom:20
            }}
            onPress={() => handleLanguageChange('english')}
          >
            <Text style={{
              textAlign:'center',
              color: langState.language === 'english' ? 'white' : '#2D2D2D',
              fontWeight:'500',
              fontSize:16
            }}>
              English
            </Text>
          </Pressable>
          
          <Button onPress={() => setShowLanguageModal(false)}>
            {t('close')}
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

export default ProfilePage;