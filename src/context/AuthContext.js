import AsyncStorage from '@react-native-async-storage/async-storage';
import createDataContext from "./CreateDataContext";
import { CommonActions } from '@react-navigation/native';

const authReducer = (state, action) => {
    switch (action.type) {
        case 'signin':
            return {token:action.payload.token, 
                    fullName:action.payload.fullName, 
                    role:action.payload.role, 
                    phoneNumber:action.payload.phoneNumber, 
                    registrationNumber:action.payload.registrationNumber, 
                };
        case 'logout':
            return {}
        default: 
            return state;
    }
};

const logout = dispatch => async (navigation) =>{
    await AsyncStorage.removeItem('X-ACCESS-TOKEN')
    dispatch({ type:'logout'})
    // navigation.navigate('Login')
    navigation.dispatch(
                 CommonActions.reset({
                   index: 0,
                   routes: [{ name: 'UserLogin' }],
                 })
               );
}

const signin = dispatch => async ({ token, fullName, role, phoneNumber, registrationNumber }) => {
    try{
        await AsyncStorage.setItem('X-ACCESS-TOKEN',token)

        dispatch({ 
                type:'signin', 
                payload:{ token, fullName, role, phoneNumber, registrationNumber }
            })
    }
    catch ( err ) {
            console.warn(err.message || "Something went wrong in signin.")
    }
};

export const { Provider, Context } = createDataContext(
    authReducer,
    { logout, signin},
    {token: null, fullName:null, role:null, phoneNumber:null, registrationNumber:null}
);