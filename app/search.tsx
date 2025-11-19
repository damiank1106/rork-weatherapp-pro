import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Search, MapPin, Star, Navigation } from 'lucide-react-native';
import { useWeather } from '@/contexts/WeatherContext';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { searchCities } from '@/utils/weatherApi';
import * as Haptics from 'expo-haptics';

export default function SearchScreen() {
  const {
    favorites,
    addFavorite,
    removeFavorite,
    selectLocation,
    isFavorite,
    getCurrentLocation,
    isLoadingLocation,
  } = useWeather();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const searchMutation = useMutation({
    mutationFn: (searchQuery: string) => searchCities(searchQuery),
  });

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.length >= 3) {
      searchMutation.mutate(text);
    } else if (text.length === 0) {
      searchMutation.reset();
    }
  };

  const handleSelectLocation = async (location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  }) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    await selectLocation({
      latitude: location.lat,
      longitude: location.lon,
      city: location.name,
      country: location.country,
      isCurrent: false,
    });
    router.back();
  };

  const handleToggleFavorite = async (location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  }) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const isAlreadyFavorite = isFavorite(location.lat, location.lon);
    if (isAlreadyFavorite) {
      await removeFavorite(location.lat, location.lon);
    } else {
      await addFavorite({
        latitude: location.lat,
        longitude: location.lon,
        city: location.name,
        country: location.country,
        isCurrent: false,
      });
    }
  };

  const handleUseCurrentLocation = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    getCurrentLocation();
    setTimeout(() => {
      router.back();
    }, 500);
  };

  const gradientColors = ['#1e293b', '#334155', '#475569'];

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <BlurView intensity={30} style={styles.inputBlur}>
            <Search color="rgba(255,255,255,0.6)" size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a city"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={query}
              onChangeText={handleSearch}
              autoFocus
            />
          </BlurView>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={handleUseCurrentLocation}
          disabled={isLoadingLocation}
        >
          <BlurView intensity={30} style={styles.buttonBlur}>
            {isLoadingLocation ? (
              <ActivityIndicator color="#60a5fa" />
            ) : (
              <Navigation color="#60a5fa" size={24} />
            )}
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>Use Current Location</Text>
              <Text style={styles.locationDetails}>
                {isLoadingLocation ? 'Getting location...' : 'GPS'}
              </Text>
            </View>
          </BlurView>
        </TouchableOpacity>

        {favorites.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>FAVORITES</Text>
            {favorites.map((location) => (
              <TouchableOpacity
                key={`${location.latitude}-${location.longitude}`}
                style={styles.locationItem}
                onPress={() => handleSelectLocation(location)}
              >
                <BlurView intensity={30} style={styles.itemBlur}>
                  <MapPin color="rgba(255,255,255,0.6)" size={20} />
                  <View style={styles.locationInfo}>
                    <Text style={styles.locationName}>{location.city}</Text>
                    <Text style={styles.locationDetails}>{location.country}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleToggleFavorite(location)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Star color="#fbbf24" size={20} fill="#fbbf24" />
                  </TouchableOpacity>
                </BlurView>
              </TouchableOpacity>
            ))}
          </>
        )}

        {searchMutation.isPending && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#60a5fa" />
          </View>
        )}

        {searchMutation.data && searchMutation.data.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>RESULTS</Text>
            {searchMutation.data.map((location, index) => {
              const isLocationFavorite = isFavorite(location.lat, location.lon);
              return (
                <TouchableOpacity
                  key={`${location.lat}-${location.lon}-${index}`}
                  style={styles.locationItem}
                  onPress={() => handleSelectLocation(location)}
                >
                  <BlurView intensity={30} style={styles.itemBlur}>
                    <MapPin color="rgba(255,255,255,0.6)" size={20} />
                    <View style={styles.locationInfo}>
                      <Text style={styles.locationName}>
                        {location.name}
                        {location.state && `, ${location.state}`}
                      </Text>
                      <Text style={styles.locationDetails}>
                        {location.country}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleToggleFavorite(location)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Star
                        color={isLocationFavorite ? '#fbbf24' : 'rgba(255,255,255,0.4)'}
                        size={20}
                        fill={isLocationFavorite ? '#fbbf24' : 'none'}
                      />
                    </TouchableOpacity>
                  </BlurView>
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {searchMutation.isError && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>Failed to search cities</Text>
            <Text style={styles.errorDetails}>
              Please check your internet connection
            </Text>
          </View>
        )}

        {query.length >= 3 &&
          !searchMutation.isPending &&
          !searchMutation.isError &&
          searchMutation.data?.length === 0 && (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No cities found</Text>
            </View>
          )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  searchInputContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  inputBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 4,
  },
  currentLocationButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  buttonBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  locationItem: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  itemBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  locationDetails: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '400',
    marginTop: 2,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noResults: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  noResultsText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '400',
  },
  errorDetails: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 4,
  },
});
