import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ChevronRight } from 'lucide-react-native';
import { useWeather } from '@/contexts/WeatherContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { getColors } from '@/constants/screenSizes';

export default function SettingsScreen() {
  const { settings, updateSettings } = useWeather();
  const colors = getColors();
  const gradientColors = [colors.background.primary, colors.background.secondary, colors.background.tertiary];

  const handleUnitChange = async (metric: boolean) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await updateSettings({
      units: metric ? 'metric' : 'imperial',
      temperatureUnit: metric ? '°C' : '°F',
      speedUnit: metric ? 'km/h' : 'mph',
      pressureUnit: metric ? 'hPa' : 'inHg',
    });
  };

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>UNITS</Text>

            <View style={styles.card}>
              <BlurView intensity={30} style={styles.cardBlur}>
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Temperature Unit</Text>
                    <Text style={styles.settingValue}>
                      {settings.temperatureUnit}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Use Metric System</Text>
                    <Text style={styles.settingDescription}>
                      °C, km/h, hPa
                    </Text>
                  </View>
                  <Switch
                    value={settings.units === 'metric'}
                    onValueChange={handleUnitChange}
                    trackColor={{ false: '#475569', true: '#60a5fa' }}
                    thumbColor="#fff"
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Speed Unit</Text>
                    <Text style={styles.settingValue}>{settings.speedUnit}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Pressure Unit</Text>
                    <Text style={styles.settingValue}>
                      {settings.pressureUnit}
                    </Text>
                  </View>
                </View>
              </BlurView>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ABOUT</Text>

            <View style={styles.card}>
              <BlurView intensity={30} style={styles.cardBlur}>
                <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                  <Text style={styles.settingLabel}>Data Source</Text>
                  <View style={styles.settingRight}>
                    <Text style={styles.settingValue}>OpenWeatherMap</Text>
                    <ChevronRight color="rgba(255,255,255,0.5)" size={20} />
                  </View>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                  <Text style={styles.settingLabel}>Version</Text>
                  <View style={styles.settingRight}>
                    <Text style={styles.settingValue}>1.0.0</Text>
                    <ChevronRight color="rgba(255,255,255,0.5)" size={20} />
                  </View>
                </TouchableOpacity>
              </BlurView>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Weather data provided by OpenWeatherMap
            </Text>
            <Text style={styles.footerText}>Built with React Native & Expo</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardBlur: {
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 2,
  },
  settingValue: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  footer: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 32,
  },
  footerText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '400',
  },
});
