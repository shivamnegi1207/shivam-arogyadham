import { StyleSheet } from "react-native";

export const DashboardStyle = StyleSheet.create({
    wrapper:{
        backgroundColor:'#FAFAFA',
        justifyContent:"space-between",
        flex:1,
    },
    heading:{
        fontFamily:"Poppins-Bold",
        fontSize:26,
        lineHeight:39,
        textAlign:"center",
        color:'#AC4A90',
        marginBottom:40
    },
    subHeading:{
        fontFamily:"Poppins-Bold",
        fontSize:18,
        lineHeight:27,
        textAlign:"center",
        color: "#2D2D2D",
        marginBottom:30
    },
    logo:{
        width:'100%',
        height:60,
        marginHorizontal:'auto',
        marginBottom:20
    }
})