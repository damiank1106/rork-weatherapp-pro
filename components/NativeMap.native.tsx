import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import MapView, { PROVIDER_DEFAULT, UrlTile, Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

interface NativeMapProps {
  activeLocation: {
    latitude: number;
    longitude: number;
    isCurrent: boolean;
  };
  showRadar?: boolean;
}

export default function NativeMap({ activeLocation, showRadar = true }: NativeMapProps) {
  const mapRef = useRef<MapView>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(prev => prev + 1);
  }, [showRadar]);

  return (
    <MapView
      key={key}
      ref={mapRef}
      provider={PROVIDER_DEFAULT}
      style={styles.map}
      initialRegion={{
        latitude: activeLocation.latitude,
        longitude: activeLocation.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      }}
      showsUserLocation={activeLocation.isCurrent}
      showsMyLocationButton={false}
      pitchEnabled
      rotateEnabled
    >
      {showRadar && (
        <UrlTile
          urlTemplate="https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png"
          maximumZ={10}
          minimumZ={4}
          tileSize={256}
          zIndex={1}
          opacity={0.6}
        />
      )}
      <Marker
        coordinate={{
          latitude: activeLocation.latitude,
          longitude: activeLocation.longitude,
        }}
        title="Your Location"
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width,
    height,
  },
});
