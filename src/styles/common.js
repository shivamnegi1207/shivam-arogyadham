import { StyleSheet } from "react-native";

export const commonStyle = StyleSheet.create({
    commonButton:{
        button:{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            borderRadius: 8,
            elevation: 2,
            backgroundColor: '#01c43d'
        },
        text:{
            fontFamily:"Montserrat-Bold",
            fontSize: 14,
            lineHeight: 24,
            color: '#FFFF',
        }
    },

})