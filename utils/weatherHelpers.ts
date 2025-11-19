export function getWeatherIcon(code: number, isDay: boolean = true): string {
  if (code >= 200 && code < 300) return '⛈️';
  if (code >= 300 && code < 400) return '🌧️';
  if (code >= 500 && code < 600) return '🌧️';
  if (code >= 600 && code < 700) return '🌨️';
  if (code >= 700 && code < 800) return '🌫️';
  if (code === 800) return isDay ? '☀️' : '🌙';
  if (code === 801) return isDay ? '🌤️' : '☁️';
  if (code === 802) return '⛅';
  if (code >= 803) return '☁️';
  return '🌤️';
}

export function getWeatherGradient(code: number, isDay: boolean = true): string[] {
  if (code >= 200 && code < 300) {
    return ['#1e3a8a', '#1e293b', '#0f172a'];
  }
  if (code >= 300 && code < 600) {
    return ['#475569', '#64748b', '#94a3b8'];
  }
  if (code >= 600 && code < 700) {
    return ['#cbd5e1', '#e2e8f0', '#f1f5f9'];
  }
  if (code >= 700 && code < 800) {
    return ['#9ca3af', '#d1d5db', '#e5e7eb'];
  }
  if (code === 800) {
    if (isDay) {
      return ['#0ea5e9', '#38bdf8', '#7dd3fc'];
    } else {
      return ['#1e293b', '#334155', '#475569'];
    }
  }
  if (code > 800) {
    return ['#64748b', '#94a3b8', '#cbd5e1'];
  }
  return ['#0ea5e9', '#38bdf8', '#7dd3fc'];
}

export function formatTemp(temp: number, unit: '°C' | '°F'): string {
  return `${Math.round(temp)}${unit}`;
}

export function formatTime(timestamp: number, format: '12h' | '24h' = '12h'): string {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  if (format === '24h') {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}${ampm}`;
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayIndex = date.getDay();
  return days[dayIndex];
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function formatSpeed(speed: number, unit: 'km/h' | 'mph'): string {
  return `${Math.round(speed)} ${unit}`;
}

export function formatPressure(pressure: number, unit: 'hPa' | 'inHg'): string {
  if (unit === 'inHg') {
    const inHg = pressure * 0.02953;
    return `${inHg.toFixed(2)} ${unit}`;
  }
  return `${Math.round(pressure)} ${unit}`;
}

export function getUVILevel(uvi: number): { level: string; color: string } {
  if (uvi <= 2) return { level: 'Low', color: '#22c55e' };
  if (uvi <= 5) return { level: 'Moderate', color: '#eab308' };
  if (uvi <= 7) return { level: 'High', color: '#f97316' };
  if (uvi <= 10) return { level: 'Very High', color: '#ef4444' };
  return { level: 'Extreme', color: '#a855f7' };
}

export function isNightTime(current: number, sunrise: number, sunset: number): boolean {
  return current < sunrise || current > sunset;
}
