import { Image, ScrollView, Text, View } from "react-native";
import { InitialStyle } from "../styles/initial";
import CommonButton from "../components/commonBtn";
import { useEffect, useState } from "react";
import axios from "../config/axios";
import { CommonActions } from "@react-navigation/native";

const InitialPage = ({navigation}) => {

  // const [loading,setLoading] = useState(true);
  // const [userData,setUserData] = useState(null);

  // const getCurrentUser = async() =>{
  //   try{
  //     const response = await axiosAuth.get('/users/get-user-data')
  //     if(response.data){
  //       if(response.data.user){
  //         setUserData({...response.data.user,screening:response.data.screening});
  //       }
  //       else{
  //         setUserData(null);
  //       }
  //     }
  //   }
  //   catch(error){
  //     setUserData(null)
  //   }
  //   finally{
  //     setLoading(false);
  //   }
  // }

  // useEffect(()=>{
  //   getCurrentUser();
  // },[])

  // const handleRedirect = () =>{
  //   if(userData && userData.children && userData.screening == "complete"){
  //     return navigation.dispatch(
  //       CommonActions.reset({
  //         index: 0,
  //         routes: [{ name: 'AllPackages' }],
  //       })
  //     );
  //   }

  //   if(userData && userData.children){
  //     return navigation.dispatch(
  //       CommonActions.reset({
  //         index: 0,
  //         routes: [{ name: 'Questionnaire' }],
  //       })
  //     );
  //   }

  //   if(userData){
  //     return navigation.dispatch(
  //       CommonActions.reset({
  //         index: 0,
  //         routes: [{ name: 'Cognitive' }],
  //       })
  //     );
  //   }
  //   return navigation.navigate('LandingPage');
  // }

  const handleRedirect = () =>{
    return navigation.navigate('LandingPage');
  }

  return (
    <ScrollView contentContainerStyle={InitialStyle.wrapper}>
        <View>
            <Image source={require('../../assets/images/logo.png')} resizeMode='contain' style={InitialStyle.logo}/>
            <View style={InitialStyle.sliderView}>
                <Image source={require('../../assets/images/slideFirst.png')} resizeMode='cover' style={{width:"100%",height:"100%"}} />
            </View>
            <Text style={InitialStyle.heading}>John Doe</Text>
            <Text style={InitialStyle.subheading}>Expertise</Text>
            <Text style={InitialStyle.content}>Patient Behaviour</Text>
        </View>
        <View>
        <CommonButton title="Get Started" 
        // disabled={loading} 
        onpress={()=>handleRedirect()} />
        </View>
    </ScrollView>
  );
}
export default InitialPage