import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { translations } from '../utils/translations';
import axios from '../config/axios';

const Profile = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const { language, toggleLanguage } = useContext(LanguageContext);
  const t = translations[language];
  
  const [showDateModal, setShowDateModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [consultationDates, setConsultationDates] = useState([]);
  const [selectedDateData, setSelectedDateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [datesLoading, setDatesLoading] = useState(false);

  const fetchConsultationDates = async () => {
    setDatesLoading(true);
    try {
      const response = await axios.get('/getPatientAllConsultationDates');
      if (response.data && response.data.allDates) {
        setConsultationDates(response.data.allDates);
      }
    } catch (error) {
      console.error('Error fetching dates:', error);
      Alert.alert(t.error, t.failedToLoadDates);
    } finally {
      setDatesLoading(false);
    }
  };

  const fetchDateDetails = async (date) => {
    setLoading(true);
    try {
      const response = await axios.get(`/getPatientDetailByDate/${date}`);
      if (response.data && response.data.data) {
        setSelectedDateData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching date details:', error);
      Alert.alert(t.error, t.failedToLoadDetails);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    fetchDateDetails(date);
    setShowDateModal(false);
  };

  const handleLogout = () => {
    Alert.alert(
      t.logout,
      t.logoutConfirmation,
      [
        { text: t.cancel, style: 'cancel' },
        { 
          text: t.logout, 
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.navigate('Landing');
          }
        }
      ]
    );
  };

  const handleLanguageChange = (newLanguage) => {
    toggleLanguage();
    setShowLanguageModal(false);
  };

  const renderDateItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dateItem}
      onPress={() => handleDateSelect(item)}
    >
      <Text style={styles.dateText}>{String(item)}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.profile}</Text>
      </View>

      {/* User Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.userInformation}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t.name}:</Text>
          <Text style={styles.infoValue}>{String(user?.name || t.notAvailable)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t.phoneNumber}:</Text>
          <Text style={styles.infoValue}>{String(user?.phone || t.notAvailable)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t.email}:</Text>
          <Text style={styles.infoValue}>{String(user?.email || t.notAvailable)}</Text>
        </View>
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.contactInformation}</Text>
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel}>{t.address}:</Text>
          <Text style={styles.contactValue}>
            Jadi Buti Farms, Kolhupani, Uttarakhand 248007
          </Text>
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel}>{t.email}:</Text>
          <Text style={styles.contactValue}>info@arogyapath.org</Text>
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel}>{t.timing}:</Text>
          <Text style={styles.contactValue}>
            {language === 'hindi' ? 'सोमवार से रविवार : सुबह 9 बजे से शाम 4 बजे तक' : 'Monday to Sunday : 9am to 4pm'}
          </Text>
        </View>
      </View>

      {/* Language Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.languageSettings}</Text>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => setShowLanguageModal(true)}
        >
          <Text style={styles.languageButtonText}>
            {t.currentLanguage}: {language === 'hindi' ? 'हिंदी' : 'English'}
          </Text>
          <Text style={styles.changeText}>{t.changeLanguage}</Text>
        </TouchableOpacity>
      </View>

      {/* Consultation History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.consultationHistory}</Text>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => {
            setShowDateModal(true);
            fetchConsultationDates();
          }}
        >
          <Text style={styles.historyButtonText}>{t.viewConsultationHistory}</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Details */}
      {selectedDateData?.payment_details && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.paymentDetails}</Text>
          <View style={styles.paymentCard}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>{t.actualAmount}:</Text>
              <Text style={styles.paymentValue}>₹{String(selectedDateData.payment_details.actual_amount || 0)}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>{t.discount}:</Text>
              <Text style={styles.paymentValue}>₹{String(selectedDateData.payment_details.discount || 0)}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>{t.mapAmount}:</Text>
              <Text style={styles.paymentValue}>₹{String(selectedDateData.payment_details.map_amount || 0)}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>{t.previousBalance}:</Text>
              <Text style={styles.paymentValue}>₹{String(selectedDateData.payment_details.prev_balance || 0)}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Logout Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>{t.logout}</Text>
        </TouchableOpacity>
      </View>

      {/* Date Selection Modal */}
      <Modal
        visible={showDateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.selectConsultationDate}</Text>
            
            {datesLoading ? (
              <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
            ) : (
              <FlatList
                data={consultationDates}
                keyExtractor={(item) => String(item)}
                renderItem={renderDateItem}
                style={styles.datesList}
              />
            )}
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDateModal(false)}
            >
              <Text style={styles.closeButtonText}>{t.close}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.languageModalContent}>
            <Text style={styles.modalTitle}>{t.selectLanguage}</Text>
            
            <TouchableOpacity
              style={[styles.languageOption, language === 'english' && styles.selectedLanguage]}
              onPress={() => handleLanguageChange('english')}
            >
              <Text style={[styles.languageOptionText, language === 'english' && styles.selectedLanguageText]}>
                English
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.languageOption, language === 'hindi' && styles.selectedLanguage]}
              onPress={() => handleLanguageChange('hindi')}
            >
              <Text style={[styles.languageOptionText, language === 'hindi' && styles.selectedLanguageText]}>
                हिंदी
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={styles.closeButtonText}>{t.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    marginVertical: 10,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  contactInfo: {
    marginBottom: 15,
  },
  contactLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 5,
  },
  contactValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  languageButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  changeText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  historyButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  paymentLabel: {
    fontSize: 16,
    color: '#666',
  },
  paymentValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    maxHeight: '70%',
    borderRadius: 10,
    padding: 20,
  },
  languageModalContent: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  datesList: {
    maxHeight: 300,
  },
  dateItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  languageOption: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  selectedLanguage: {
    backgroundColor: '#4CAF50',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  selectedLanguageText: {
    color: '#fff',
  },
  closeButton: {
    backgroundColor: '#666',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Profile;