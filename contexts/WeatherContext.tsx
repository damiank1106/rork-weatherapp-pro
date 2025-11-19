import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation } from '@tanstack/react-query';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';
import { Location as LocationType, WeatherData, Units, WeatherSettings } from '@/types/weather';
import { fetchWeatherByCoords, reverseGeocode, searchCities } from '@/utils/weatherApi';
import { Platform } from 'react-native';

const STORAGE_KEYS = {
  FAVORITES: '@weather_favorites',
  SETTINGS: '@weather_settings',
  SELECTED_LOCATION: '@weather_selected_location',
};

const DEFAULT_SETTINGS: WeatherSettings = {
  units: 'metric',
  temperatureUnit: '°C',
  speedUnit: 'km/h',
  pressureUnit: 'hPa',
  theme: 'auto',
};

export const [WeatherProvider, useWeather] = createContextHook(() => {
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(null);
  const [favorites, setFavorites] = useState<LocationType[]>([]);
  const [settings, setSettings] = useState<WeatherSettings>(DEFAULT_SETTINGS);
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);

  useEffect(() => {
    loadStoredData();
    checkLocationPermission();
  }, []);

  const loadStoredData = async () => {
    try {
      const [storedFavorites, storedSettings, storedLocation] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.FAVORITES),
        AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
        AsyncStorage.getItem(STORAGE_KEYS.SELECTED_LOCATION),
      ]);

      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }

      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }

      if (storedLocation) {
        setSelectedLocation(JSON.parse(storedLocation));
      }
    } catch (error) {
      console.error('Failed to load stored data:', error);
    }
  };

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationPermission(status);
    } catch (error) {
      console.error('Failed to check location permission:', error);
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
      return status === Location.PermissionStatus.GRANTED;
    } catch (error) {
      console.error('Failed to request location permission:', error);
      return false;
    }
  };

  const getCurrentLocationMutation = useMutation({
    mutationFn: async () => {
      const hasPermission = locationPermission === Location.PermissionStatus.GRANTED || await requestLocationPermission();
      
      if (!hasPermission) {
        throw new Error('Location permission denied');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const geocode = await reverseGeocode(
        location.coords.latitude,
        location.coords.longitude
      );

      const newLocation: LocationType = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        city: geocode.city,
        country: geocode.country,
        isCurrent: true,
      };

      return newLocation;
    },
    onSuccess: (location) => {
      setCurrentLocation(location);
      setSelectedLocation(location);
      AsyncStorage.setItem(STORAGE_KEYS.SELECTED_LOCATION, JSON.stringify(location));
    },
  });

  const activeLocation = selectedLocation || currentLocation;

  const weatherQuery = useQuery({
    queryKey: ['weather', activeLocation?.latitude, activeLocation?.longitude, settings.units],
    queryFn: () => {
      if (!activeLocation) {
        throw new Error('No location available');
      }
      if (typeof activeLocation.latitude !== 'number' || typeof activeLocation.longitude !== 'number') {
        throw new Error('Invalid location coordinates');
      }
      if (isNaN(activeLocation.latitude) || isNaN(activeLocation.longitude)) {
        throw new Error('Invalid location coordinates (NaN)');
      }
      return fetchWeatherByCoords(
        activeLocation.latitude,
        activeLocation.longitude,
        settings.units
      );
    },
    enabled: !!activeLocation && 
             typeof activeLocation.latitude === 'number' && 
             typeof activeLocation.longitude === 'number' &&
             !isNaN(activeLocation.latitude) && 
             !isNaN(activeLocation.longitude),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const addFavorite = useCallback(async (location: LocationType) => {
    const newFavorites = [...favorites, { ...location, isCurrent: false }];
    setFavorites(newFavorites);
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavorites));
  }, [favorites]);

  const removeFavorite = useCallback(async (latitude: number, longitude: number) => {
    const newFavorites = favorites.filter(
      (fav) => fav.latitude !== latitude || fav.longitude !== longitude
    );
    setFavorites(newFavorites);
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavorites));
  }, [favorites]);

  const selectLocation = useCallback(async (location: LocationType) => {
    setSelectedLocation(location);
    await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_LOCATION, JSON.stringify(location));
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<WeatherSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  }, [settings]);

  const isFavorite = useCallback((latitude: number, longitude: number) => {
    return favorites.some(
      (fav) => Math.abs(fav.latitude - latitude) < 0.01 && Math.abs(fav.longitude - longitude) < 0.01
    );
  }, [favorites]);

  return {
    currentLocation,
    selectedLocation,
    activeLocation,
    favorites,
    settings,
    locationPermission,
    weather: weatherQuery.data,
    isLoadingWeather: weatherQuery.isLoading,
    weatherError: weatherQuery.error,
    isLoadingLocation: getCurrentLocationMutation.isPending,
    getCurrentLocation: getCurrentLocationMutation.mutate,
    requestLocationPermission,
    addFavorite,
    removeFavorite,
    selectLocation,
    updateSettings,
    isFavorite,
    refetchWeather: weatherQuery.refetch,
  };
});
