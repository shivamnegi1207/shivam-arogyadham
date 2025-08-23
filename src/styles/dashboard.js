import { StyleSheet } from "react-native";

export const DashboardStyle = StyleSheet.create({
    wrapper: {
        backgroundColor: '#FAFAFA',
        minHeight: '100%',
        paddingBottom: 20
    },
    logo: {
        width: '100%',
        height: 60,
        marginHorizontal: 'auto',
        marginBottom: 20
    },
    heading: {
        fontFamily: "Poppins-Bold",
        fontSize: 24,
        lineHeight: 36,
        textAlign: "center",
        color: "#2D2D2D",
        marginBottom: 20
    },
    subHeading: {
        fontFamily: "Poppins-Bold",
        fontSize: 20,
        lineHeight: 30,
        textAlign: "center",
        color: "#01c43d",
        marginBottom: 20
    },
    content: {
        fontFamily: "Poppins-Regular",
        color: "#5F5F5F",
        fontSize: 14,
        lineHeight: 21,
        textAlign: 'center'
    },
    card: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D2D2D',
        marginBottom: 10
    },
    cardContent: {
        fontSize: 14,
        color: '#5F5F5F',
        lineHeight: 20
    }
});