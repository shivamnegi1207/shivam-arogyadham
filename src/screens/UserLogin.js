import {  Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { UserLoginStyle } from "../styles/userLogin";
import CommonButton from "../components/commonBtn";
import { Dialog, Portal, TextInput } from "react-native-paper";
import { CommonActions } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import { axiosLocal } from "../config/axios";
import { Context as AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserLoginPage = ({navigation}) => {
  
    const { signin } = useContext(AuthContext);
    const [loading,setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [mobile,setMobile] = useState('');
    const { register, setValue, handleSubmit, setError, clearErrors, formState: { errors } } = useForm();
    
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    
      useEffect(() => {
        register('mobile', {
          required: 'पंजीकरण संख्या अनिवार्य है',
        });
      }, [register]);

      const handleMobileChange = (value) =>{
        const newValue = value.replace(/[^0-9]/g, '')
        setMobile(newValue);
        setValue('mobile', newValue);
      }

      const hadleSignup = async(data) =>{
        clearErrors();
        setLoading(true);
        try{
          const randomString = Array.from({ length: 15 }, () =>
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(
              Math.floor(Math.random() * 62)
            )
          ).join('');
          
          let accessKey = await AsyncStorage.getItem(data.mobile);

          if(!accessKey){
            accessKey = randomString;
            await AsyncStorage.setItem(data.mobile,accessKey);
          }

          const response = await axiosLocal.post('/auth/patient-login', {phoneNumber:data.mobile, accessKey});
          if(response.data && response.data.data){
            const {token,fullName, role, phoneNumber, registrationNumber} = response.data.data;
            signin({token,fullName, role, phoneNumber, registrationNumber});
            showModal();
          }
        }
        catch(error){
          if(error.response && error.response.data){
            if(error.response.data.message){
              setError('mobile', {
                type: 'manual',
                message: error.response.data.message
              });
              console.warn(error.response.data.message);
            }
          }
          console.warn(error.message || "Something went wrong in login.")
        }
        finally{
          setLoading(false);
        }
      }
    

  return (
    <>
      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView  contentContainerStyle={{ flexGrow: 1 }}>
        <View  style={UserLoginStyle.wrapper}>
        <Image source={require('../../assets/images/userLogin.png')} resizeMode='contain' style={UserLoginStyle.featuredImage}/>
        <Text style={UserLoginStyle.heading} > आरोग्य पथ में आपका स्वागत है।</Text>
        <Text style={UserLoginStyle.note} >कृपया पंजीकरण संख्या दर्ज करें।</Text>
        <TextInput
              mode="outlined"
              cursorColor='#2D2D2Dcc' 
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={10}
              value={mobile}
              onChangeText={text => handleMobileChange(text)}
              inputMode="numeric"
              keyboardType="numeric"
              placeholderTextColor="#2D2D2Dcc"
              dense
              label={<Text style={UserLoginStyle.inputText.label}>पंजीकरण संख्या</Text>}
              placeholder="पंजीकरण संख्या"
              style={UserLoginStyle.inputText}
              outlineColor="#2D2D2Dcc"
              activeOutlineColor="#2D2D2Dcc"
              outlineStyle={{
                borderWidth:1,
                borderRadius:8
              }}
              left={
                <TextInput.Icon
                  icon="account-outline"	
                  color="#2D2D2Dcc"
                  style={UserLoginStyle.mobileIcon}
                />
              }
            />
          {errors.mobile && <Text style={UserLoginStyle.errorText}>{errors.mobile.message}</Text>}
        <CommonButton title={loading ? "कृपया प्रतीक्षा करें" :"लॉग इन"} disabled={loading} onpress={handleSubmit(hadleSignup)}/>
        </View>
        </ScrollView>
    </KeyboardAvoidingView>
     <Portal>
     <Dialog visible={visible} dismissable={false} style={{backgroundColor:"#FFFF",borderRadius:8}}>
       <Dialog.Content style={{marginTop:0}}>
           <Image source={require('../../assets/images/check.png')} resizeMode='contain' style={UserLoginStyle.modalImage}/>
         <Text style={UserLoginStyle.heading} > लॉग इन सफल रहा</Text>
         <Text style={{...UserLoginStyle.text,textAlign:"center"}} >आप पूरी तरह शुरू करने के लिए तैयार हैं </Text>
       </Dialog.Content>
       <Dialog.Actions >
         <Pressable style={UserLoginStyle.closeModalBtn} 
         onPress={()=>{
           hideModal();
           navigation.dispatch(
             CommonActions.reset({
               index: 0,
               routes: [{ name: 'Dashboard' }],
             })
           );
           }}
           >
           <Text style={UserLoginStyle.closeModalBtnText}>ठीक है</Text>
         </Pressable>
         </Dialog.Actions>
     </Dialog>
   </Portal>
   </>
  );
}
export default UserLoginPage