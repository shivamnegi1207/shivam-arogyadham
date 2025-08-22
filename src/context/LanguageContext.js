import AsyncStorage from '@react-native-async-storage/async-storage';
import createDataContext from "./CreateDataContext";

const languageReducer = (state, action) => {
    switch (action.type) {
        case 'set_language':
            return { ...state, language: action.payload };
        default: 
            return state;
    }
};

const setLanguage = dispatch => async (language) => {
    try {
        await AsyncStorage.setItem('app_language', language);
        dispatch({ type: 'set_language', payload: language });
    } catch (err) {
        console.warn(err.message || "Something went wrong in setLanguage.");
    }
};

const loadLanguage = dispatch => async () => {
    try {
        const savedLanguage = await AsyncStorage.getItem('app_language');
        const language = savedLanguage || 'hindi'; // Default to Hindi
        dispatch({ type: 'set_language', payload: language });
    } catch (err) {
        console.warn(err.message || "Something went wrong in loadLanguage.");
        dispatch({ type: 'set_language', payload: 'hindi' });
    }
};

export const { Provider, Context } = createDataContext(
    languageReducer,
    { setLanguage, loadLanguage },
    { language: 'hindi' }
);