import { StyleSheet } from "react-native";

export const InitialStyle = StyleSheet.create({
    wrapper:{
        backgroundColor:'#FAFAFA',
        height:"100%",
        paddingTop:35,
        paddingBottom:50,
        paddingHorizontal:30,
        justifyContent:'space-between'        
    },
    heading:{
        fontFamily:"Poppins-Bold",
        fontSize:20,
        lineHeight:30,
        textAlign:"center",
        color: "#2D2D2D",
        marginBottom:20
    },
    logo:{
        width:'100%',
        height:60,
        marginHorizontal:'auto',
        marginBottom:40,
        marginTop:20
    },
    sliderView:{
        width:250,
        height:250,
        borderRadius:500,
        marginHorizontal:'auto',
        overflow:'hidden',
        marginBottom:20
    },
    subheading:{
        fontFamily:"Poppins-Bold",
        fontSize:15,
        lineHeight:22.5,
        textAlign:"center",
        color: "#01c43d",
        marginBottom:0
    },
    content:{
        fontFamily:"Poppins-Regular",
        color:"#5F5F5F",
        fontSize:12,
        lineHeight:18,
        textAlign:'center'
    }
})