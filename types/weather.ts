export interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  isCurrent: boolean;
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  pressure: number;
  humidity: number;
  visibility: number;
  windSpeed: number;
  windDeg: number;
  windGust?: number;
  clouds: number;
  dt: number;
  sunrise: number;
  sunset: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  uvi?: number;
  dewPoint?: number;
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  feelsLike: number;
  pressure: number;
  humidity: number;
  dewPoint: number;
  uvi: number;
  clouds: number;
  visibility: number;
  windSpeed: number;
  windDeg: number;
  windGust?: number;
  pop: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  rain?: {
    '1h': number;
  };
}

export interface DailyForecast {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feelsLike: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  dewPoint: number;
  windSpeed: number;
  windDeg: number;
  windGust?: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: number;
  pop: number;
  rain?: number;
  uvi: number;
  summary?: string;
}

export interface WeatherAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  alerts?: WeatherAlert[];
}

export type Units = 'metric' | 'imperial';

export interface WeatherSettings {
  units: Units;
  temperatureUnit: '°C' | '°F';
  speedUnit: 'km/h' | 'mph';
  pressureUnit: 'hPa' | 'inHg';
  theme: 'light' | 'dark' | 'auto';
}
