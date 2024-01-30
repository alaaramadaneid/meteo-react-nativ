import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState({});

  const getWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=95435d65d392e73961b46d9001d1df26&units=metric`
      );
      const json = await response.json();
      setData(json);
      console.log(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location is required!');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        if (location.coords.latitude && location.coords.longitude) {
          await getWeatherData(location.coords.latitude, location.coords.longitude);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getLocation();
  }, []);

  let text = 'Waiting...';

  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{data.name}</Text>
      {data.weather && data.weather[0] && (
        <Image style={styles.image} source={{ uri: `http://openweathermap.org/img/w/${data.weather[0].icon}.png` }} />
      )}
      <Text style={styles.paragraph}>{data.main && data.main.temp}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BAE8EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paragraph: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
});
