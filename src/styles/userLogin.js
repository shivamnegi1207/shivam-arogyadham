import { StyleSheet } from "react-native";

export const UserLoginStyle = StyleSheet.create({
    wrapper:{
        backgroundColor:'#FAFAFA',
        height:"100%",
        paddingTop:65,
        paddingBottom:20,
        paddingHorizontal:20
    },
    featuredImage:{
        width:"80%",
        marginHorizontal:'auto',
        marginBottom:40
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    heading:{
        fontFamily:"Poppins-Bold",
        fontSize:20,
        lineHeight:30,
        textAlign:"center",
        color: "#2D2D2D",
        marginBottom:8
    },
    note:{
        color:'#2D2D2Dcc',
        fontFamily:"Poppins-Regular",
        fontSize:13,
        lineHeight:21,
        textAlign:"center",
        marginBottom:10
    },
    inputText:{
        marginBottom:30,
        color:"#2D2D2Dcc",
        label:{
            color:"#2D2D2Dcc",
            fontSize:16,
            fontWeight:400
        },
        fontSize:16,
        fontFamily:"Poppins-Regular",
    },
    mobileIcon:{
        borderRadius:0,
    },
    link:{
        fontFamily:"Poppins-Bold"
    },
    linkText:{
        fontFamily:"Poppins-Regular",
        fontSize:16,
        lineHeight:24,
        textAlign:'center',
        color:'#2D2D2D',
        marginTop:30
    },
    modalImage:{
        marginHorizontal:'auto',
        marginBottom:30,
        borderRadius:50,
        height:100,
        marginTop:-50,
        width:100,
        backgroundColor:'#fff',
    },
    closeModalBtn:{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#01c43d',
        width:'100%',
        marginTop:20
    },
    text:{
        color:'#2D2D2D',
        fontFamily:"Poppins-Regular",
        fontSize:13,
        lineHeight:21,
    },
    closeModalBtnText:{
        fontFamily:"Montserrat-Bold",
        fontSize: 14,
        lineHeight: 24,
        color: '#FFFF'
    }
})