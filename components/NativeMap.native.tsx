import React, { useEffect, useRef, useState } from 'react';
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

// Number of frames in the animation
const FRAME_COUNT = 8;
// How fast to switch frames (ms)
const FRAME_INTERVAL_MS = 900;

const TOMORROW_TILE_URL_TEMPLATE =
  'https://api.tomorrow.io/v4/map/tile/{z}/{x}/{y}/precipitationIntensity/{time}.png?apikey=ZXyYMmwRq2cognFGiozyfw0XWPo86BMO';

export default function NativeMap({ activeLocation, showRadar = true }: NativeMapProps) {
  const mapRef = useRef<MapView | null>(null);

  // Used to force MapView remount when radar mode changes
  const [key, setKey] = useState(0);

  // Animation state: list of timestamps + current index
  const [frameTimes, setFrameTimes] = useState<string[]>([]);
  const [frameIndex, setFrameIndex] = useState(0);

  // Build the list of timestamps whenever radar is enabled
  useEffect(() => {
    if (!showRadar) {
      return;
    }

    const now = new Date();
    const frames: string[] = [];

    // Last ~35 minutes in 5-minute steps (8 frames total)
    for (let i = FRAME_COUNT - 1; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 5 * 60 * 1000);
      frames.push(t.toISOString());
    }

    setFrameTimes(frames);
    setFrameIndex(frames.length - 1);
    setKey(prev => prev + 1); // remount MapView on toggle
  }, [showRadar, activeLocation.latitude, activeLocation.longitude]);

  // Cycle through the timestamps to create animation
  useEffect(() => {
    if (!showRadar || frameTimes.length === 0) {
      return;
    }

    const id = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % frameTimes.length);
    }, FRAME_INTERVAL_MS);

    return () => clearInterval(id);
  }, [showRadar, frameTimes]);

  // Build the final URL for the current frame
  const tileUrl =
    showRadar && frameTimes.length > 0
      ? TOMORROW_TILE_URL_TEMPLATE.replace(
          '{time}',
          encodeURIComponent(frameTimes[frameIndex])
        )
      : null;

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
      {tileUrl && (
        <UrlTile
          urlTemplate={tileUrl}
          maximumZ={12}
          minimumZ={2}
          tileSize={256}
          zIndex={1}
          opacity={0.7}
        />
      )}

      <Marker
        coordinate={{
          latitude: activeLocation.latitude,
          longitude: activeLocation.longitude,
        }}
        title={activeLocation.isCurrent ? 'Your Location' : 'Location'}
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
