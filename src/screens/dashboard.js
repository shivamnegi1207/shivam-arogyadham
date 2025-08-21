import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { DashboardStyle } from "../styles/dashboard";
import { Context as AuthContext } from '../context/AuthContext';
import { useContext, useEffect, useState } from "react";
import { Audio } from 'expo-av';
import { axiosAuth, baseURL } from "../config/axios";
import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Loader from "../components/loader";
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardPage = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const { state, logout } = useContext(AuthContext);
  const [sounds, setSounds] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [soundPositions, setSoundPositions] = useState({});
  const [soundProgress, setSoundProgress] = useState({});
  const [soundBufferProgress, setSoundBufferProgress] = useState({}); // Track buffer progress for each sound
  const [soundDuration, setSoundDuration] = useState({});
  const [soundObjects, setSoundObjects] = useState({});

  const getMappedSounds = async () => {
    try {
      const response = await axiosAuth.get('/sounds');
      if (response.data && response.data.data) {
        const { docs } = response.data.data;
        setSounds(docs);

        const initialProgress = docs.reduce((acc, item) => {
          acc[item._id] = 0; 
          return acc;
        }, {});
        setSoundProgress(initialProgress);
        setSoundBufferProgress(initialProgress); // Initialize buffer progress to 0
      }
    } catch (err) {
      console.warn(err.message || "Something went wrong in getMappedSounds.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getMappedSounds();
  
    const unsubscribe = navigation.addListener('blur', async () => {
      // Stop and unload all sounds when navigating away
      Object.values(soundObjects).forEach(async (soundObj) => {
        await soundObj?.stopAsync();
        await soundObj?.unloadAsync();
      });
  
      setCurrentlyPlaying(null);
      setIsPaused(false);
    });
  
    return () => {
      // Cleanup when component unmounts
      unsubscribe();
      Object.values(soundObjects).forEach(async (soundObj) => {
        await soundObj?.stopAsync();
        await soundObj?.unloadAsync();
      });
    };
  }, [navigation, soundObjects]);
  

  const playPauseSound = async (audioUrl, id) => {
    try {
      const token = await AsyncStorage.getItem('X-ACCESS-TOKEN');
      if (!token) {
        console.warn("No token found.");
        return;
      }
      const soundUrl = `${audioUrl}?token=${token}&id=${id}`; // Append token and sound ID to the URL

    if (currentlyPlaying === id) {
      if (isPaused) {
        const position = soundPositions[id] || 0;
        await soundObjects[id].playFromPositionAsync(position);
        setIsPaused(false);
      } else {
        const status = await soundObjects[id].getStatusAsync();
        setSoundPositions((prev) => ({ ...prev, [id]: status.positionMillis }));
        await soundObjects[id].pauseAsync();
        setIsPaused(true);
      }
    } else {
      if (currentlyPlaying && soundObjects[currentlyPlaying]) {
        const status = await soundObjects[currentlyPlaying].getStatusAsync();
        if (status) {
          setSoundPositions((prev) => ({
            ...prev,
            [currentlyPlaying]: status.positionMillis,
          }));
        }
        await soundObjects[currentlyPlaying].stopAsync();
        await soundObjects[currentlyPlaying].unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync({ uri: soundUrl });
      setSoundObjects((prev) => ({
        ...prev,
        [id]: newSound,
      }));
      setCurrentlyPlaying(id);
      setIsPaused(false);

      const startPosition = soundPositions[id] || 0;
      await newSound.playFromPositionAsync(startPosition);

      const status = await newSound.getStatusAsync();
      setSoundDuration((prev) => ({
        ...prev,
        [id]: status.durationMillis || 0,
      }));

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          if (status.isPlaying) {
            setSoundProgress((prev) => ({ ...prev, [id]: status.positionMillis / status.durationMillis }));
          }

          if (status.playableDurationMillis) {
            setSoundBufferProgress((prev) => ({
              ...prev,
              [id]: status.playableDurationMillis / status.durationMillis,
            }));
          }

          if (status.didJustFinish) {
            setCurrentlyPlaying(null);
            setIsPaused(false);
            setSoundProgress((prev) => ({ ...prev, [id]: 0 }));
            setSoundBufferProgress((prev) => ({ ...prev, [id]: 0 }));
            newSound.unloadAsync();
          }
        }
      });
    }
  } catch (error) {
    console.error("Error playing sound:", error);
    }
  };

  const resetSound = async (id) => {
    setSoundProgress((prev) => ({ ...prev, [id]: 0 }));
    setSoundPositions((prev) => ({ ...prev, [id]: 0 }));

    if (soundObjects[id]) {
      await soundObjects[id].stopAsync();
      await soundObjects[id].unloadAsync();
      setSoundObjects((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      if (currentlyPlaying === id) {
        setCurrentlyPlaying(null);
        setIsPaused(false);
      }
    }
  };

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const renderItem = ({ item, index }) => (
    <View style={{
      backgroundColor: 'white',
      margin: 5,
      borderRadius: 10,
      padding: 10,
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    }}
    key={index}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent:'flex-end' }}>
        <EvilIcons name="refresh" size={24} color="black" onPress={() => resetSound(item._id)} />
      </View>

      <TouchableOpacity
        onPress={() => playPauseSound(baseURL + "stream/" + (item?.soundId?.file || ""), item._id)}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        {currentlyPlaying === item._id && !isPaused? (
          <AntDesign name="pausecircle" size={24} color="black" style={{ width: 40 }} />
        ) : (
          <AntDesign name="playcircleo" size={24} color="black" style={{ width: 40 }} />
        )}

        <Text style={{ flex: 1 }}>{item?.soundId?.title || ""}</Text>
        <Text style={{ textAlign: 'right', flex: 1 }}>
          {formatTime(soundProgress[item._id] * soundDuration[item._id] || 0)} / {formatTime(soundDuration[item._id] || 0)}
        </Text>
      </TouchableOpacity>

      <View style={{ width: '100%', height: 10, backgroundColor: '#d3d3d3', borderRadius: 5, marginTop: 10, overflow: 'hidden' }}>
        <View
          style={{
            height: '100%',
            backgroundColor: '#a9a9a9',
            position: 'absolute',
            width: `${(soundBufferProgress[item._id] || 0) * 100}%`,
          }}
        />
        <View
          style={{
            height: '100%',
            backgroundColor: '#01c43d',
            width: `${(soundProgress[item._id] || 0) * 100}%`,
          }}
        />
      </View>
    </View>
  );

  const handleSignOut = () => {
    logout(navigation);
  }

  if (loading) { return (<Loader />) };

  return (
    <View style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={DashboardStyle.wrapper}>
        <View style={{ paddingHorizontal: 30, paddingTop: 65 }}>
          <Image
            source={require('../../assets/images/logo.png')}
            resizeMode="contain"
            style={DashboardStyle.logo}
          />
          <Text style={DashboardStyle.subHeading}>
            Welcome {state.fullName || ''}
          </Text>
          {sounds && sounds.length > 0 && sounds.map((item, index) => renderItem({ item, index }))}
          <Text style={{ paddingVertical: 30 }}>
            Note: Use Headphones For Better Experience.
          </Text>
        </View>
      </View>
    </ScrollView>

    {/* Sticky Footer */}
    <View style={{ flexDirection: 'row', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <Pressable style={{ flex: 1, alignItems: 'center', padding: 10 }} onPress={()=>navigation.navigate('Profile')}>
        <FontAwesome6 name="user-gear" size={24} color="#10331b" style={{ width: 30 }} />
      </Pressable>
      <Pressable style={{ flex: 1, alignItems: 'center', padding: 10 }}>
        <FontAwesome6 name="music" size={30} color="#01c43d" style={{ width: 40 }} />
      </Pressable>
      <Pressable style={{ flex: 1, alignItems: 'center', padding: 10 }} onPress={()=>navigation.navigate('Medicine')}>
        <MaterialCommunityIcons name="pill" size={24} color="#10331b" style={{ width: 30 }} />
      </Pressable>
      <Pressable style={{ flex: 1, alignItems: 'center', padding: 10 }} onPress={()=>navigation.navigate('HealthPlan')}>
        <Ionicons name="fitness" size={24} color="#10331b" style={{ width: 30 }} />
      </Pressable>
    </View>
  </View>
  );
};

export default DashboardPage;
