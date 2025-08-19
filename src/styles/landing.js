import { StyleSheet } from "react-native";

export const LandingStyle = StyleSheet.create({
    wrapper:{
        backgroundColor:'#FAFAFA',
        height:"100%",
        paddingTop:65,
        paddingBottom:20,
        paddingHorizontal:30
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
    },
    featuredImage:{
        width:"80%",
        marginHorizontal:'auto',
        height:"80%"
    },
    logo:{
        width:'100%',
        height:60,
        marginHorizontal:'auto',
        marginBottom:20
    },
    content:{
        fontFamily:"Poppins-Bold",
        fontSize:18,
        lineHeight:30,
        textAlign:"center",
        color: "#01c43d",
        marginBottom:10
    },
    link:{
        fontFamily:"Poppins-Regular",
        fontSize:14,
        lineHeight:21,
        textAlign:"center",
        color: "#2D2D2D",
        textDecorationLine:'underline',
        marginTop:20
    }
})