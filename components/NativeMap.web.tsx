import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface NativeMapProps {
  activeLocation: {
    latitude: number;
    longitude: number;
    isCurrent: boolean;
  };
}

export default function NativeMap(_props: NativeMapProps) {
  return (
    <View style={styles.map}>
      <LinearGradient
        colors={['#0ea5e9', '#38bdf8', '#7dd3fc']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.webMapPlaceholder}>
        <Text style={styles.webMapText}>Interactive Map</Text>
        <Text style={styles.webMapSubtext}>
          Maps are available on mobile devices
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width,
    height,
  },
  webMapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  webMapText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700' as const,
  },
  webMapSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500' as const,
  },
});
