import {  Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { UserLoginStyle } from "../styles/userLogin";
import CommonButton from "../components/commonBtn";
import { Dialog, Portal, TextInput } from "react-native-paper";
import { CommonActions } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import { axiosLocal } from "../config/axios";
import { Context as AuthContext } from '../context/AuthContext';

const UserLoginPage = ({navigation}) => {
  
    const { signin } = useContext(AuthContext);
    const [loading,setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [userName,setUserName] = useState('');
    const [password,setPassword] = useState('');
    const { register, setValue, handleSubmit, setError, clearErrors, formState: { errors } } = useForm();
    
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    
      useEffect(() => {
        register('userName', {
          required: 'उपयोगकर्ता नाम अनिवार्य है',
        });
        register('password', {
          required: 'पासवर्ड अनिवार्य है',
        });
      }, [register]);

      const handleUserNameChange = (value) =>{
        setUserName(value);
        setValue('userName', value);
      }

      const handlePasswordChange = (value) =>{
        setPassword(value);
        setValue('password', value);
      }

      const hadleSignup = async(data) =>{
        clearErrors();
        setLoading(true);
        try{
          const response = await axiosLocal.post('/login', {userName:data.userName, password:data.password});
          if(response.data && response.data.token){
            const {token, userName, role, message} = response.data;
            // Store the token and user data
            signin({token, fullName: userName, role, phoneNumber: '', registrationNumber: ''});
            // Check if login was successful
            if(message === "User login successfull."){
              // Redirect to dashboard (home page)
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'HealthPlan' }],
                })
              );
            } else {
              showModal();
            }
          } else {
            showModal();
          }
        }
        catch(error){
          if(error.response && error.response.data){
            if(error.response.data.message){
              setError('userName', {
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
        <Text style={UserLoginStyle.note} >कृपया अपना उपयोगकर्ता नाम और पासवर्ड दर्ज करें।</Text>
        <TextInput
              mode="outlined"
              cursorColor='#2D2D2Dcc' 
              autoCapitalize="none"
              autoCorrect={false}
              value={userName}
              onChangeText={text => handleUserNameChange(text)}
              placeholderTextColor="#2D2D2Dcc"
              dense
             label="उपयोगकर्ता नाम"
              placeholder="उपयोगकर्ता नाम"
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
          {errors.userName && <Text style={UserLoginStyle.errorText}>{errors.userName.message}</Text>}
        <TextInput
              mode="outlined"
              cursorColor='#2D2D2Dcc' 
              autoCapitalize="none"
              autoCorrect={false}
              value={password}
              onChangeText={text => handlePasswordChange(text)}
              placeholderTextColor="#2D2D2Dcc"
              dense
              secureTextEntry
             label="पासवर्ड"
              placeholder="पासवर्ड"
              style={UserLoginStyle.inputText}
              outlineColor="#2D2D2Dcc"
              activeOutlineColor="#2D2D2Dcc"
              outlineStyle={{
                borderWidth:1,
                borderRadius:8
              }}
              left={
                <TextInput.Icon
                  icon="lock-outline"	
                  color="#2D2D2Dcc"
                  style={UserLoginStyle.mobileIcon}
                />
              }
            />
          {errors.password && <Text style={UserLoginStyle.errorText}>{errors.password.message}</Text>}
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