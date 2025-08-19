import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from './src/screens/landing';
import { AntDesign } from '@expo/vector-icons';
import UserLoginPage from './src/screens/UserLogin';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Provider as AuthProvider } from './src/context/AuthContext';
// import InitialPage from './src/screens/initialScreen';
import DashboardPage from './src/screens/dashboard';
import ProfilePage from './src/screens/profile';

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    'Montserrat-Bold':require('./assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-Regular':require('./assets/fonts/Montserrat-Regular.ttf'),
    'Poppins-Bold':require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-SemiBold':require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Medium':require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular':require('./assets/fonts/Poppins-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#00B6E0', 
      outline: '#CBCBCB',
    },
  };

  return (
    <AuthProvider>
    <PaperProvider theme={theme}>
    <NavigationContainer >
      <Stack.Navigator backBehavior="order" screenOptions={{animation:"slide_from_right"}} >
        {/* <Stack.Screen name="InitialPage" component={InitialPage} options={{headerShown:false}}/> */}
        <Stack.Screen name="LandingPage" component={LandingPage} options={{headerShown:false}}/>
        <Stack.Screen name="UserLogin" 
          component={UserLoginPage} 
          options={({navigation}) => ({
            title:"आरोग्यपथ",
            headerTitleAlign:'center',
            contentStyle:{
              backgroundColor:'#FAFAFA',
            },
            headerTitleStyle:{
              color:'#01c43d',
              fontSize:16,
              fontFamily:"Poppins-Bold"
            },
            headerLeft:()=> navigation.canGoBack() ? (
              <AntDesign name="arrowleft" 
                size={20} 
                color="#2D2D2D" 
                onPress={()=>navigation.goBack()}
                style={{paddingLeft:5,paddingTop:15,paddingRight:20,paddingBottom:15}}
              />
            )
            :null
          })} 
        />
        <Stack.Screen name="Dashboard" component={DashboardPage} options={{headerShown:false}}/>
        <Stack.Screen name="Profile" component={ProfilePage} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
    </AuthProvider>
  );
}
