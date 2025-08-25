import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { UserLoginStyle } from "../styles/userLogin";
import { TextInput, Modal, Portal } from "react-native-paper";
import { useContext, useState } from "react";
import { Context as AuthContext } from '../context/AuthContext';
import { Context as LanguageContext } from '../context/LanguageContext';
import { axiosLocal } from "../config/axios";
import CommonButton from "../components/commonBtn";
import ReactNativeOTPInput from "../components/otpInput";
import { getTranslation } from "../utils/translations";
import { CommonActions } from "@react-navigation/native";

const UserLoginPage = ({ navigation }) => {
  const { signin } = useContext(AuthContext);
  const { state: langState, loadLanguage } = useContext(LanguageContext);
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  useState(() => {
    loadLanguage();
  }, []);

  const t = (key) => getTranslation(langState.language, key);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSendOTP = async () => {
    setError('');
    
    if (!phoneNumber.trim()) {
      setError(t('phoneRequired'));
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError(t('invalidPhone'));
      return;
    }

    setLoading(true);
    try {
      const response = await axiosLocal.post('/sendOTP', {
        phoneNumber: phoneNumber
      });

      if (response.data && response.data.message === "OTP sent successfully.") {
        setOtpSent(true);
        setShowModal(true);
      } else {
        setError(response.data?.message || t('otpSendFailed'));
      }
    } catch (err) {
      console.warn('Send OTP Error:', err);
      setError(err.response?.data?.message || t('networkError'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    
    if (!otp.trim() || otp.length !== 4) {
      setError(t('invalidOtp'));
      return;
    }

    setLoading(true);
    try {
      const response = await axiosLocal.post('/login', {
        userName: phoneNumber,
        password: otp
      });

      if (response.data && response.data.token) {
        await signin({
          token: response.data.token,
          fullName: response.data.fullName || 'User',
          role: response.data.role || 'Patient',
          phoneNumber: phoneNumber,
          registrationNumber: response.data.registrationNumber || ''
        });

        setShowModal(false);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'HealthPlan' }],
          })
        );
      } else {
        setError(response.data?.message || t('loginFailed'));
      }
    } catch (err) {
      console.warn('Login Error:', err);
      setError(err.response?.data?.message || t('invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp('');
    await handleSendOTP();
  };

  return (
    <ScrollView style={UserLoginStyle.wrapper}>
      <Image 
        source={require('../../assets/images/userLogin.png')} 
        resizeMode='contain' 
        style={UserLoginStyle.featuredImage}
      />
      
      <Text style={UserLoginStyle.heading}>
        {t('welcomeBack')}
      </Text>
      
      <Text style={UserLoginStyle.note}>
        {t('loginInstruction')}
      </Text>

      {error ? (
        <Text style={UserLoginStyle.errorText}>{error}</Text>
      ) : null}

      <TextInput
        label={t('phoneNumber')}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        maxLength={10}
        style={UserLoginStyle.inputText}
        mode="outlined"
        disabled={otpSent}
        left={<TextInput.Icon icon="phone" />}
      />

      <CommonButton 
        title={otpSent ? t('resendOtp') : t('sendOtp')}
        onpress={otpSent ? handleResendOTP : handleSendOTP}
        disabled={loading}
      />

      <Text style={UserLoginStyle.linkText}>
        {t('loginHelp')}
      </Text>

      {/* OTP Verification Modal */}
      <Portal>
        <Modal 
          visible={showModal} 
          onDismiss={() => setShowModal(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            margin: 20,
            padding: 30,
            borderRadius: 15,
            alignItems: 'center'
          }}
        >
          <Image 
            source={require('../../assets/images/check.png')} 
            resizeMode='contain' 
            style={UserLoginStyle.modalImage}
          />
          
          <Text style={UserLoginStyle.heading}>
            {t('verifyOtp')}
          </Text>
          
          <Text style={[UserLoginStyle.text, { textAlign: 'center', marginBottom: 20 }]}>
            {t('otpSentTo')} {phoneNumber}
          </Text>

          {error ? (
            <Text style={[UserLoginStyle.errorText, { textAlign: 'center' }]}>
              {error}
            </Text>
          ) : null}

          <ReactNativeOTPInput 
            OTP={otp}
            handleOTP={setOtp}
          />

          <CommonButton 
            title={t('verifyAndLogin')}
            onpress={handleVerifyOTP}
            disabled={loading || otp.length !== 4}
            style={UserLoginStyle.closeModalBtn}
            textStyle={UserLoginStyle.closeModalBtnText}
          />

          <Pressable onPress={handleResendOTP} disabled={loading}>
            <Text style={[UserLoginStyle.link, { marginTop: 15, textAlign: 'center' }]}>
              {t('resendOtp')}
            </Text>
          </Pressable>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

export default UserLoginPage;