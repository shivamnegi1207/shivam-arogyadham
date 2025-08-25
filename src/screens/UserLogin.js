import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { UserLoginStyle } from "../styles/userLogin";
import { TextInput } from "react-native-paper";
import { useContext, useState } from "react";
import { Context as AuthContext } from '../context/AuthContext';
import { Context as LanguageContext } from '../context/LanguageContext';
import { axiosLocal } from "../config/axios";
import CommonButton from "../components/commonBtn";
import { getTranslation } from "../utils/translations";
import { CommonActions } from "@react-navigation/native";

const UserLoginPage = ({ navigation }) => {
  const { signin } = useContext(AuthContext);
  const { state: langState, loadLanguage } = useContext(LanguageContext);
  
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useState(() => {
    loadLanguage();
  }, []);

  const t = (key) => getTranslation(langState.language, key);

  const validateInputs = () => {
    if (!userName.trim()) {
      setError(t('userNameRequired'));
      return false;
    }
    if (!password.trim()) {
      setError(t('passwordRequired'));
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setError('');
    
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axiosLocal.post('/login', {
        userName: userName.trim(),
        password: password.trim()
      });

      if (response.data && response.data.token) {
        await signin({
          token: response.data.token,
          fullName: response.data.userName.name || 'User',
          role: response.data.role || 'Patient',
          phoneNumber: password,
          registrationNumber: userName
        });

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
        label={t('userName')}
        value={userName}
        onChangeText={setUserName}
        style={UserLoginStyle.inputText}
        mode="outlined"
        disabled={loading}
        left={<TextInput.Icon icon="account" />}
        placeholder={t('userNamePlaceholder')}
      />

      <TextInput
        label={t('password')}
        value={password}
        onChangeText={setPassword}
        keyboardType="phone-pad"
        style={UserLoginStyle.inputText}
        mode="outlined"
        disabled={loading}
        left={<TextInput.Icon icon="lock" />}
        placeholder={t('passwordPlaceholder')}
        secureTextEntry={false}
      />

      <CommonButton 
        title={t('login')}
        onpress={handleLogin}
        disabled={loading}
      />

      <Text style={UserLoginStyle.linkText}>
        {t('loginHelp')}
      </Text>
    </ScrollView>
  );
};

export default UserLoginPage;