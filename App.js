import React, { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  const [osoite, setOsoite] = useState('');
  const [koordinaatit, setKoordinaatit] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const API_KEY = '65cbbef8d18b8773649221etg6eb7b8';

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
      { koordinaatit && (
        <MapView
          style={styles.map}
          initialRegion={mapRegion}
          region={mapRegion}
          onRegionChange={setMapRegion}
        >
          <Marker coordinate={koordinaatit} />
        </MapView>
      )}
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
