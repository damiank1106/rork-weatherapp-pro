import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const { width, height } = Dimensions.get('window');

interface NativeMapProps {
  activeLocation: {
    latitude: number;
    longitude: number;
    isCurrent: boolean;
  };
  showRadar?: boolean;
}

const API_KEY = 'ZXyYMmwRq2cognFGiozyfw0XWPo86BMO';

const FRAME_COUNT = 8;
const FRAME_INTERVAL_MS = 900;

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
}

function AnimatedWeatherLayer({ showRadar }: { showRadar: boolean }) {
  const [frameTimes, setFrameTimes] = useState<string[]>([]);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    if (!showRadar) {
      return;
    }

    const now = new Date();
    const frames: string[] = [];

    for (let i = FRAME_COUNT - 1; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 5 * 60 * 1000);
      frames.push(t.toISOString());
    }

    setFrameTimes(frames);
    setFrameIndex(frames.length - 1);
  }, [showRadar]);

  useEffect(() => {
    if (!showRadar || frameTimes.length === 0) {
      return;
    }

    const id = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % frameTimes.length);
    }, FRAME_INTERVAL_MS);

    return () => clearInterval(id);
  }, [showRadar, frameTimes]);

  const tileUrl = showRadar && frameTimes.length > 0
    ? `https://api.tomorrow.io/v4/map/tile/{z}/{x}/{y}/precipitationIntensity/${frameTimes[frameIndex]}.png?apikey=${API_KEY}`
    : null;

  if (!tileUrl) return null;

  return (
    <TileLayer
      url={tileUrl}
      opacity={0.7}
      zIndex={1000}
      maxZoom={12}
      minZoom={2}
    />
  );
}

export default function NativeMap({ activeLocation, showRadar = true }: NativeMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
      });
    }
  }, []);

  if (!isClient) {
    return <View style={styles.map} />;
  }

  const center: [number, number] = [activeLocation.latitude, activeLocation.longitude];

  return (
    <View style={styles.map}>
      <MapContainer
        center={center}
        zoom={9}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <AnimatedWeatherLayer showRadar={showRadar} />
        
        <MapUpdater center={center} />
        
        <Marker position={center}>
          <Popup>
            {activeLocation.isCurrent ? 'Your Location' : 'Location'}
          </Popup>
        </Marker>
      </MapContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width,
    height,
  },
});
