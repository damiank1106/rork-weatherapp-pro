import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  MapPin,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Sun,
  Moon,
  CloudRain,
  Search,
} from 'lucide-react-native';
import {
  getColors,
  getFontSizes,
  getIconSizes,
  getSpacing,
  getBorderRadius,
  getContainerSizes,
} from '@/constants/screenSizes';
import { useWeather } from '@/contexts/WeatherContext';
import { useRouter } from 'expo-router';
import {
  isNightTime,
  formatTemp,
  formatTime,
  formatDate,
  getWindDirection,
  formatSpeed,
  formatPressure,
  getUVILevel,
  getWeatherIcon,
} from '@/utils/weatherHelpers';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import AIBriefCard from '@/components/AIBriefCard';

const { width } = Dimensions.get('window');
const colors = getColors();
const fontSizes = getFontSizes();
const iconSizes = getIconSizes();
const spacing = getSpacing();
const borderRadius = getBorderRadius();
const containerSizes = getContainerSizes();

export default function HomeScreen() {
  const {
    activeLocation,
    weather,
    isLoadingWeather,
    getCurrentLocation,
    isLoadingLocation,
    refetchWeather,
    settings,
  } = useWeather();

  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!activeLocation && !isLoadingLocation) {
      getCurrentLocation();
    }
  }, [activeLocation, isLoadingLocation]);

  useEffect(() => {
    if (weather) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [weather]);

  const handleRefresh = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await refetchWeather();
  };

  if (!weather || isLoadingWeather) {
    const gradientColors = [colors.background.primary, colors.background.secondary, colors.background.tertiary];
    return (
      <LinearGradient colors={gradientColors} style={styles.container}>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.text.primary} />
          <Text style={styles.loadingText}>
            {isLoadingLocation ? 'Getting your location...' : 'Loading weather data...'}
          </Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const { current, hourly, daily } = weather;
  const isNight = isNightTime(current.dt, current.sunrise, current.sunset);
  const gradientColors = [colors.background.primary, colors.background.secondary, colors.background.tertiary];
  const weatherIcon = getWeatherIcon(current.weather[0].id, !isNight);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -10],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={StyleSheet.absoluteFill} />
      
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
          },
        ]}
      >
        <BlurView intensity={80} style={StyleSheet.absoluteFill} />
        <SafeAreaView edges={['top']} style={styles.headerContent}>
          <Text style={styles.headerTitle}>{activeLocation?.city}</Text>
          <TouchableOpacity
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              router.push('/search');
            }}
          >
            <Search color="#fff" size={24} />
          </TouchableOpacity>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={handleRefresh}
            tintColor="#ffffff"
          />
        }
      >
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <Animated.View
            style={[
              styles.mainContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: titleTranslateY }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.locationButton}
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                router.push('/search');
              }}
            >
              <MapPin color="#fff" size={20} />
              <Text style={styles.locationText}>{activeLocation?.city}</Text>
            </TouchableOpacity>

            <Text style={styles.mainTemp}>
              {formatTemp(current.temp, settings.temperatureUnit)}
            </Text>

            <Text style={styles.weatherIcon}>{weatherIcon}</Text>

            <Text style={styles.weatherDescription}>
              {current.weather[0].description}
            </Text>

            <Text style={styles.highLow}>
              H:{formatTemp(current.tempMax, settings.temperatureUnit)} L:
              {formatTemp(current.tempMin, settings.temperatureUnit)}
            </Text>
          </Animated.View>

          <Animated.View style={[styles.cardsContainer, { opacity: fadeAnim }]}>
            <AIBriefCard
              location={activeLocation?.city || 'Unknown'}
              current={current}
              daily={daily[0]}
              units={settings.units}
            />
            <View style={styles.card}>
              <BlurView intensity={30} style={styles.cardBlur}>
                <Text style={styles.cardTitle}>HOURLY FORECAST</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.hourlyScroll}
                  contentContainerStyle={styles.hourlyContent}
                >
                  {hourly.slice(0, 24).map((hour, index) => (
                    <View key={hour.dt} style={styles.hourlyItem}>
                      <Text style={styles.hourlyTime}>
                        {index === 0 ? 'Now' : formatTime(hour.dt)}
                      </Text>
                      <Text style={styles.hourlyIcon}>
                        {getWeatherIcon(
                          hour.weather[0].id,
                          !isNightTime(hour.dt, current.sunrise, current.sunset)
                        )}
                      </Text>
                      <Text style={styles.hourlyTemp}>
                        {formatTemp(hour.temp, settings.temperatureUnit)}
                      </Text>
                      {hour.pop > 0 && (
                        <View style={styles.hourlyPop}>
                          <CloudRain color="#60a5fa" size={12} />
                          <Text style={styles.hourlyPopText}>
                            {Math.round(hour.pop * 100)}%
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </ScrollView>
              </BlurView>
            </View>

            <View style={styles.card}>
              <BlurView intensity={30} style={styles.cardBlur}>
                <Text style={styles.cardTitle}>7-DAY FORECAST</Text>
                {daily.map((day, index) => (
                  <View key={day.dt} style={styles.dailyItem}>
                    <Text style={styles.dailyDay}>
                      {index === 0 ? 'Today' : formatDate(day.dt)}
                    </Text>
                    <View style={styles.dailyWeather}>
                      <Text style={styles.dailyIcon}>
                        {getWeatherIcon(day.weather[0].id, true)}
                      </Text>
                      {day.pop > 0 && (
                        <View style={styles.dailyPop}>
                          <CloudRain color="#60a5fa" size={14} />
                          <Text style={styles.dailyPopText}>
                            {Math.round(day.pop * 100)}%
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.dailyTemps}>
                      <Text style={styles.dailyTempLow}>
                        {formatTemp(day.temp.min, settings.temperatureUnit)}
                      </Text>
                      <View style={styles.tempBar}>
                        <View style={styles.tempBarFill} />
                      </View>
                      <Text style={styles.dailyTempHigh}>
                        {formatTemp(day.temp.max, settings.temperatureUnit)}
                      </Text>
                    </View>
                  </View>
                ))}
              </BlurView>
            </View>

            <View style={styles.detailsGrid}>
              <View style={[styles.card, styles.detailCard]}>
                <BlurView intensity={30} style={styles.cardBlur}>
                  <Wind color="rgba(255,255,255,0.7)" size={24} />
                  <Text style={styles.detailLabel}>Wind</Text>
                  <Text style={styles.detailValue}>
                    {formatSpeed(current.windSpeed, settings.speedUnit)}
                  </Text>
                  <Text style={styles.detailSubtext}>
                    {getWindDirection(current.windDeg)}
                  </Text>
                </BlurView>
              </View>

              <View style={[styles.card, styles.detailCard]}>
                <BlurView intensity={30} style={styles.cardBlur}>
                  <Droplets color="rgba(255,255,255,0.7)" size={24} />
                  <Text style={styles.detailLabel}>Humidity</Text>
                  <Text style={styles.detailValue}>{current.humidity}%</Text>
                </BlurView>
              </View>

              <View style={[styles.card, styles.detailCard]}>
                <BlurView intensity={30} style={styles.cardBlur}>
                  <Eye color="rgba(255,255,255,0.7)" size={24} />
                  <Text style={styles.detailLabel}>Visibility</Text>
                  <Text style={styles.detailValue}>
                    {(current.visibility / 1000).toFixed(1)} km
                  </Text>
                </BlurView>
              </View>

              <View style={[styles.card, styles.detailCard]}>
                <BlurView intensity={30} style={styles.cardBlur}>
                  <Gauge color="rgba(255,255,255,0.7)" size={24} />
                  <Text style={styles.detailLabel}>Pressure</Text>
                  <Text style={styles.detailValue}>
                    {formatPressure(current.pressure, settings.pressureUnit)}
                  </Text>
                </BlurView>
              </View>

              {current.uvi !== undefined && (
                <View style={[styles.card, styles.detailCard]}>
                  <BlurView intensity={30} style={styles.cardBlur}>
                    <Sun color="rgba(255,255,255,0.7)" size={24} />
                    <Text style={styles.detailLabel}>UV Index</Text>
                    <Text style={styles.detailValue}>{current.uvi.toFixed(1)}</Text>
                    <Text
                      style={[
                        styles.detailSubtext,
                        { color: getUVILevel(current.uvi).color },
                      ]}
                    >
                      {getUVILevel(current.uvi).level}
                    </Text>
                  </BlurView>
                </View>
              )}

              <View style={[styles.card, styles.detailCard]}>
                <BlurView intensity={30} style={styles.cardBlur}>
                  {isNight ? (
                    <Moon color="rgba(255,255,255,0.7)" size={24} />
                  ) : (
                    <Sun color="rgba(255,255,255,0.7)" size={24} />
                  )}
                  <Text style={styles.detailLabel}>
                    {isNight ? 'Sunrise' : 'Sunset'}
                  </Text>
                  <Text style={styles.detailValue}>
                    {formatTime(isNight ? current.sunrise : current.sunset)}
                  </Text>
                </BlurView>
              </View>
            </View>
          </Animated.View>
        </SafeAreaView>
      </Animated.ScrollView>
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: 100,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  safeArea: {
    flex: 1,
  },
  mainContent: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  locationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  mainTemp: {
    color: '#fff',
    fontSize: 96,
    fontWeight: '200',
    marginTop: 8,
  },
  weatherIcon: {
    fontSize: 64,
    marginVertical: 8,
  },
  weatherDescription: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  highLow: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 4,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    paddingTop: 32,
    gap: 16,
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
  cardTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  hourlyScroll: {
    marginHorizontal: -16,
  },
  hourlyContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  hourlyItem: {
    alignItems: 'center',
    gap: 8,
    minWidth: 60,
  },
  hourlyTime: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  hourlyIcon: {
    fontSize: 32,
  },
  hourlyTemp: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  hourlyPop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hourlyPopText: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: '600',
  },
  dailyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    minHeight: containerSizes.dailyDayWidth,
  },
  dailyDay: {
    color: '#fff',
    fontSize: fontSizes.small,
    fontWeight: '500',
    width: containerSizes.dailyDayWidth,
  },
  dailyWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.tiny,
    flex: 1,
    minWidth: 80,
  },
  dailyIcon: {
    fontSize: iconSizes.medium,
  },
  dailyPop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.tiny,
  },
  dailyPopText: {
    color: '#60a5fa',
    fontSize: fontSizes.mini,
    fontWeight: '600',
  },
  dailyTemps: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.tiny,
  },
  dailyTempLow: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: fontSizes.small,
    fontWeight: '500',
    width: containerSizes.dailyDayWidth - 10,
    textAlign: 'right',
  },
  tempBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  tempBarFill: {
    width: '60%',
    height: '100%',
    backgroundColor: '#60a5fa',
    borderRadius: 2,
  },
  dailyTempHigh: {
    color: '#fff',
    fontSize: fontSizes.small,
    fontWeight: '600',
    width: containerSizes.dailyDayWidth - 10,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailCard: {
    width: (width - 56) / 2,
  },
  detailLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  detailValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
    marginTop: 4,
  },
  detailSubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
});
