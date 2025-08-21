import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { DashboardStyle } from "../styles/dashboard";
import { Context as AuthContext } from '../context/AuthContext';
import { useContext, useEffect, useState } from "react";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { axiosLogin } from "../config/axios";
import { Modal, Portal, Button } from "react-native-paper";

const ProfilePage = ({ navigation }) => {
  const { state, logout } = useContext(AuthContext);
  const [consultationDates, setConsultationDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [consultationData, setConsultationData] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getConsultationDates = async () => {
    try {
      const response = await axiosLogin.get('/getPatientAllConsultationDates');
      if (response.data && response.data.allDates) {
        setConsultationDates(response.data.allDates);
      }
    } catch (error) {
      console.warn(error.message || "Error fetching consultation dates");
    }
  };

  const getConsultationData = async (date) => {
    setLoading(true);
    try {
      const response = await axiosLogin.get(`/getPatientDetailByDate/${date}`);
      if (response.data && response.data.data) {
        setConsultationData(response.data.data);
        setSelectedDate(date);
      }
    } catch (error) {
      console.warn(error.message || "Error fetching consultation data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConsultationDates();
  }, []);

  const handleSignOut = () => {
    logout(navigation);
  }


export default ProfilePage;
