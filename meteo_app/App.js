import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform ,FlatList,Image} from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoding,setLoding]= useState(true);
  const [data,setData]=useState([]);
  const getMeteo =async ()=>{
    try{
      
      const response = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=45.78190100248175&lon=4.748340591070032&appid=95435d65d392e73961b46d9001d1df26&units=metric');
      const json =await response.json();
      setData(json);
   console.log(json);
    }
    catch(error){
      console.error(error);
    }
    finally{
      setLoding(false);
    }
  };
  useEffect(()=>{
    getMeteo();
  },[]);
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location is required!');
        return;
      }
      let location = await Location.getCurrentPositionAsync({})
      setLocation(location);
    })();
  }, []);
  let text= 'Waiting..'
  if (errorMsg) {
    text= errorMsg
  }else{
    text = JSON.stringify(location)
  }

  return (
    <View style={styles.container}>
    <Text style={styles.paragraph}>{data.name}</Text>
    {data.weather && data.weather[0] && (
      <Image style={styles.image} source={{ uri: `http://openweathermap.org/img/w/${data.weather[0].icon}.png` }} />
    )}
       <Text style={styles.paragraph}>{data.main && data.main.temp}</Text>

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
  image:{
    width:100,
    height:100,
  }
});