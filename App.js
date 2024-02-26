import Geolocation from '@react-native-community/geolocation';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  const [osoite, setOsoite] = useState('');
  const [koordinaatit, setKoordinaatit] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const initialRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setMapRegion(initialRegion);
      },
      error => Alert.alert('Error', 'Failed to get current location.'),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  const showLocation = async () => {
    const response = await fetch(`https://geocode.maps.co/search?q=${encodeURIComponent(osoite)}&api_key=${API_KEY}`);
    const data = await response.json();
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      const newRegion = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
      };
      setKoordinaatit({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
      setMapRegion(newRegion);
    } else {
      Alert.alert('Osoitetta ei löytyny bro', 'Syötä oikea osoite. XD ');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter address"
        value={osoite}
        onChangeText={setOsoite}
      />
      <Button title="Show" onPress={showLocation} />
      <MapView
        style={styles.map}
        initialRegion={mapRegion}
        region={mapRegion}
        onRegionChange={setMapRegion}
        showsUserLocation={true} 
      >
        {koordinaatit && <Marker coordinate={koordinaatit} />}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  map: {
    width: '100%',
    height: 300,
    marginTop: 20,
  },
});
