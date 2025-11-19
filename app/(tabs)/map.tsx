import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useWeather } from '@/contexts/WeatherContext';
import { Layers } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import NativeMap from '@/components/NativeMap';
import { getColors } from '@/constants/screenSizes';

const { width, height } = Dimensions.get('window');
const colors = getColors();

export default function MapScreen() {
  const { activeLocation, weather, isLoadingWeather } = useWeather();
  const [showRadar, setShowRadar] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!activeLocation || isLoadingWeather) {
    const gradientColors = [colors.background.primary, colors.background.secondary, colors.background.tertiary];
    return (
      <LinearGradient colors={gradientColors} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.text.primary} />
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
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
      ) : (
        <NativeMap
          activeLocation={activeLocation}
          showRadar={showRadar}
        />
      )}

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            setShowRadar(!showRadar);
          }}
        >
          <BlurView intensity={80} style={styles.buttonBlur}>
            <Layers color="#fff" size={24} />
            <Text style={styles.buttonText}>
              {showRadar ? 'Radar On' : 'Radar Off'}
            </Text>
          </BlurView>
        </TouchableOpacity>
      </View>

      <View style={styles.locationInfo}>
        <BlurView intensity={60} tint="dark" style={styles.infoBlur}>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Text style={styles.cityName}>{activeLocation.city}</Text>
              {weather && (
                <Text style={styles.weatherInfo}>
                  {Math.round(weather.current.temp)}° · {weather.current.weather[0].description}
                </Text>
              )}
            </View>
            <View style={styles.refreshContainer}>
              <Text style={styles.refreshLabel}>Updated</Text>
              <Text style={styles.refreshTime}>
                {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </Text>
            </View>
          </View>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  map: {
    width,
    height,
  },
  controls: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoLeft: {
    flex: 1,
  },
  refreshContainer: {
    alignItems: 'flex-end',
  },
  refreshLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '500' as const,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  refreshTime: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600' as const,
    marginTop: 2,
  },
  controlButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  buttonBlur: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  locationInfo: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 33, 71, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  infoBlur: {
    padding: 16,
  },
  cityName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  weatherInfo: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500' as const,
    marginTop: 4,
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


