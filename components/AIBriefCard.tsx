import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { Sparkles } from 'lucide-react-native';
import { generateDailyBrief } from '@/utils/aiHelpers';
import { CurrentWeather, DailyForecast } from '@/types/weather';

interface AIBriefCardProps {
  location: string;
  current: CurrentWeather;
  daily: DailyForecast;
  units: 'metric' | 'imperial';
}

export default function AIBriefCard({ location, current, daily, units }: AIBriefCardProps) {
  const [brief, setBrief] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBrief();
  }, [location, current.dt]);

  const loadBrief = async () => {
    setIsLoading(true);
    try {
      const summary = await generateDailyBrief(location, current, daily, units);
      setBrief(summary);
    } catch (error) {
      console.error('Failed to load AI brief:', error);
      setBrief(`Today in ${location}: ${Math.round(current.temp)}° with ${current.weather[0].description}.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <BlurView intensity={30} style={styles.cardBlur}>
        <View style={styles.header}>
          <Sparkles color="#fbbf24" size={20} />
          <Text style={styles.cardTitle}>AI WEATHER BRIEF</Text>
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="rgba(255,255,255,0.6)" size="small" />
            <Text style={styles.loadingText}>Generating summary...</Text>
          </View>
        ) : (
          <Text style={styles.briefText}>{brief}</Text>
        )}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardBlur: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '400',
  },
  briefText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  },
});
