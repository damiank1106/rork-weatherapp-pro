import { CurrentWeather, WeatherData, Units } from '@/types/weather';

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';
const WEATHER_GOV_URL = 'https://api.weather.gov';
const GDACS_URL = 'https://www.gdacs.org/gdacsapi/api';

function getWeatherCode(code: number): { main: string; description: string; icon: string } {
  const weatherCodes: Record<number, { main: string; description: string; icon: string }> = {
    0: { main: 'Clear', description: 'clear sky', icon: '01d' },
    1: { main: 'Clear', description: 'mainly clear', icon: '01d' },
    2: { main: 'Clouds', description: 'partly cloudy', icon: '02d' },
    3: { main: 'Clouds', description: 'overcast', icon: '03d' },
    45: { main: 'Fog', description: 'foggy', icon: '50d' },
    48: { main: 'Fog', description: 'depositing rime fog', icon: '50d' },
    51: { main: 'Drizzle', description: 'light drizzle', icon: '09d' },
    53: { main: 'Drizzle', description: 'moderate drizzle', icon: '09d' },
    55: { main: 'Drizzle', description: 'dense drizzle', icon: '09d' },
    61: { main: 'Rain', description: 'slight rain', icon: '10d' },
    63: { main: 'Rain', description: 'moderate rain', icon: '10d' },
    65: { main: 'Rain', description: 'heavy rain', icon: '10d' },
    71: { main: 'Snow', description: 'slight snow', icon: '13d' },
    73: { main: 'Snow', description: 'moderate snow', icon: '13d' },
    75: { main: 'Snow', description: 'heavy snow', icon: '13d' },
    77: { main: 'Snow', description: 'snow grains', icon: '13d' },
    80: { main: 'Rain', description: 'slight rain showers', icon: '09d' },
    81: { main: 'Rain', description: 'moderate rain showers', icon: '09d' },
    82: { main: 'Rain', description: 'violent rain showers', icon: '09d' },
    85: { main: 'Snow', description: 'slight snow showers', icon: '13d' },
    86: { main: 'Snow', description: 'heavy snow showers', icon: '13d' },
    95: { main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' },
    96: { main: 'Thunderstorm', description: 'thunderstorm with slight hail', icon: '11d' },
    99: { main: 'Thunderstorm', description: 'thunderstorm with heavy hail', icon: '11d' },
  };
  return weatherCodes[code] || { main: 'Unknown', description: 'unknown', icon: '01d' };
}

async function fetchWeatherGovAlerts(latitude: number, longitude: number) {
  try {
    const pointResponse = await fetch(`${WEATHER_GOV_URL}/points/${latitude.toFixed(4)},${longitude.toFixed(4)}`);
    
    if (!pointResponse.ok) {
      console.log('Weather.gov point lookup failed, skipping alerts');
      return [];
    }

    const pointData = await pointResponse.json();
    const alertsUrl = pointData.properties?.county;
    
    if (!alertsUrl) {
      return [];
    }

    const alertsResponse = await fetch(`${alertsUrl}/alerts/active`);
    if (!alertsResponse.ok) {
      return [];
    }

    const alertsData = await alertsResponse.json();
    const features = alertsData.features || [];

    return features.map((feature: any) => ({
      sender_name: feature.properties.senderName || 'NWS',
      event: feature.properties.event || 'Weather Alert',
      start: new Date(feature.properties.onset || feature.properties.effective).getTime() / 1000,
      end: new Date(feature.properties.ends || feature.properties.expires).getTime() / 1000,
      description: feature.properties.description || feature.properties.headline || '',
      tags: [feature.properties.severity?.toLowerCase() || 'minor'],
    }));
  } catch (error) {
    console.log('Failed to fetch weather.gov alerts:', error);
    return [];
  }
}

async function fetchGDACSAlerts(latitude: number, longitude: number) {
  try {
    const response = await fetch(`${GDACS_URL}/events/geteventlist/SEARCH`);
    
    if (!response.ok) {
      console.log('GDACS API failed, skipping global alerts');
      return [];
    }

    const data = await response.json();
    const features = data.features || [];
    
    const nearbyAlerts = features.filter((feature: any) => {
      const eventLat = feature.geometry?.coordinates?.[1];
      const eventLon = feature.geometry?.coordinates?.[0];
      
      if (!eventLat || !eventLon) return false;
      
      const distance = Math.sqrt(
        Math.pow(eventLat - latitude, 2) + Math.pow(eventLon - longitude, 2)
      );
      
      return distance < 10;
    });

    return nearbyAlerts.map((feature: any) => {
      const props = feature.properties || {};
      const severity = props.alertlevel || props.severity || 'moderate';
      
      return {
        sender_name: 'GDACS',
        event: props.name || props.eventtype || 'Weather Event',
        start: props.fromdate ? new Date(props.fromdate).getTime() / 1000 : Date.now() / 1000,
        end: props.todate ? new Date(props.todate).getTime() / 1000 : (Date.now() / 1000) + 86400,
        description: props.description || props.htmldescription || 'Global disaster alert',
        tags: [severity.toLowerCase()],
      };
    });
  } catch (error) {
    console.log('Failed to fetch GDACS alerts:', error);
    return [];
  }
}

async function fetchPhilippinesAlerts(latitude: number, longitude: number) {
  try {
    const isInPhilippines = latitude >= 4.5 && latitude <= 21.5 && longitude >= 116 && longitude <= 127;
    
    if (!isInPhilippines) {
      return [];
    }

    const gdacsAlerts = await fetchGDACSAlerts(latitude, longitude);
    
    return gdacsAlerts;
  } catch (error) {
    console.log('Failed to fetch Philippines alerts:', error);
    return [];
  }
}

export async function fetchWeatherByCoords(
  latitude: number,
  longitude: number,
  units: Units = 'metric'
): Promise<WeatherData> {
  try {
    if (latitude === undefined || longitude === undefined || isNaN(latitude) || isNaN(longitude)) {
      throw new Error('Invalid coordinates provided');
    }
    
    console.log('Fetching weather for:', latitude, longitude, units);
    
    const tempUnit = units === 'metric' ? 'celsius' : 'fahrenheit';
    const windSpeedUnit = units === 'metric' ? 'kmh' : 'mph';
    const precipUnit = units === 'metric' ? 'mm' : 'inch';

    const url = `${OPEN_METEO_URL}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weathercode,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,is_day&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,uv_index_max&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weathercode,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,is_day&temperature_unit=${tempUnit}&wind_speed_unit=${windSpeedUnit}&precipitation_unit=${precipUnit}&timezone=auto`;

    const response = await fetch(url);
    console.log('Open-Meteo API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Weather API error:', response.status, errorText);
      throw new Error(`Failed to fetch weather data: ${response.status}`);
    }

    const data = await response.json();
    console.log('Weather data received successfully');

    const [weatherGovAlerts, philippinesAlerts, gdacsAlerts] = await Promise.all([
      fetchWeatherGovAlerts(latitude, longitude),
      fetchPhilippinesAlerts(latitude, longitude),
      fetchGDACSAlerts(latitude, longitude),
    ]);
    
    const alerts = [...weatherGovAlerts, ...philippinesAlerts, ...gdacsAlerts];

    const currentWeatherCode = getWeatherCode(data.current.weathercode);
    const now = Math.floor(Date.now() / 1000);

    const todayIndex = 0;
    const sunrise = new Date(data.daily.sunrise[todayIndex]).getTime() / 1000;
    const sunset = new Date(data.daily.sunset[todayIndex]).getTime() / 1000;

    return {
      current: {
        temp: data.current.temperature_2m,
        feelsLike: data.current.apparent_temperature,
        tempMin: data.daily.temperature_2m_min[todayIndex],
        tempMax: data.daily.temperature_2m_max[todayIndex],
        pressure: data.current.pressure_msl || data.current.surface_pressure,
        humidity: data.current.relative_humidity_2m,
        visibility: data.current.visibility || 10000,
        windSpeed: data.current.wind_speed_10m,
        windDeg: data.current.wind_direction_10m,
        windGust: data.current.wind_gusts_10m,
        clouds: data.current.cloud_cover,
        dt: now,
        sunrise,
        sunset,
        weather: [
          {
            id: data.current.weathercode,
            main: currentWeatherCode.main,
            description: currentWeatherCode.description,
            icon: currentWeatherCode.icon,
          },
        ],
        uvi: data.hourly.uv_index?.[0] || 0,
        dewPoint: 0,
      },
      hourly: (() => {
        const currentTime = new Date();
        const currentHourIndex = data.hourly.time.findIndex((time: string) => {
          const timeDate = new Date(time);
          return timeDate >= currentTime;
        });
        const startIndex = currentHourIndex >= 0 ? currentHourIndex : 0;
        
        return data.hourly.time.slice(startIndex, startIndex + 24).map((time: string, i: number) => {
          const index = startIndex + i;
          const weatherCode = getWeatherCode(data.hourly.weathercode[index]);
          return {
            dt: new Date(time).getTime() / 1000,
            temp: data.hourly.temperature_2m[index],
            feelsLike: data.hourly.apparent_temperature[index],
            pressure: data.current.pressure_msl,
            humidity: data.hourly.relative_humidity_2m[index],
            dewPoint: 0,
            uvi: data.hourly.uv_index?.[index] || 0,
            clouds: data.hourly.cloud_cover[index],
            visibility: data.hourly.visibility?.[index] || 10000,
            windSpeed: data.hourly.wind_speed_10m[index],
            windDeg: data.hourly.wind_direction_10m[index],
            windGust: data.hourly.wind_gusts_10m?.[index],
            pop: data.hourly.precipitation_probability[index] / 100,
            weather: [
              {
                id: data.hourly.weathercode[index],
                main: weatherCode.main,
                description: weatherCode.description,
                icon: weatherCode.icon,
              },
            ],
            rain: data.hourly.precipitation[index] > 0 ? { '1h': data.hourly.precipitation[index] } : undefined,
          };
        });
      })(),
      daily: data.daily.time.slice(0, 7).map((time: string, index: number) => {
        const weatherCode = getWeatherCode(data.daily.weathercode[index]);
        const avgTemp = (data.daily.temperature_2m_max[index] + data.daily.temperature_2m_min[index]) / 2;
        return {
          dt: new Date(time).getTime() / 1000,
          sunrise: new Date(data.daily.sunrise[index]).getTime() / 1000,
          sunset: new Date(data.daily.sunset[index]).getTime() / 1000,
          temp: {
            day: avgTemp,
            min: data.daily.temperature_2m_min[index],
            max: data.daily.temperature_2m_max[index],
            night: data.daily.temperature_2m_min[index],
            eve: avgTemp,
            morn: avgTemp,
          },
          feelsLike: {
            day: avgTemp,
            night: data.daily.temperature_2m_min[index],
            eve: avgTemp,
            morn: avgTemp,
          },
          pressure: data.current.pressure_msl,
          humidity: data.current.relative_humidity_2m,
          dewPoint: 0,
          windSpeed: data.daily.wind_speed_10m_max?.[index] || 0,
          windDeg: 0,
          windGust: data.daily.wind_gusts_10m_max?.[index],
          weather: [
            {
              id: data.daily.weathercode[index],
              main: weatherCode.main,
              description: weatherCode.description,
              icon: weatherCode.icon,
            },
          ],
          clouds: data.current.cloud_cover,
          pop: (data.daily.precipitation_probability_max?.[index] || 0) / 100,
          rain: data.daily.precipitation_sum[index],
          uvi: data.daily.uv_index_max?.[index] || 0,
          summary: weatherCode.description,
        };
      }),
      alerts,
    };
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
}

export async function searchCities(query: string): Promise<Array<{
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}>> {
  try {
    console.log('Searching cities for:', query);
    const response = await fetch(
      `${NOMINATIM_URL}/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'WeatherApp/1.0',
        },
      }
    );

    console.log('Nominatim response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Nominatim error:', response.status, errorText);
      throw new Error(`Failed to search cities: ${response.status}`);
    }

    const data = await response.json();
    console.log('Found cities:', data.length);
    
    if (!Array.isArray(data)) {
      console.error('Invalid response format:', data);
      return [];
    }
    
    return data.map((item: any) => ({
      name: item.address?.city || item.address?.town || item.address?.village || item.name || item.display_name.split(',')[0],
      country: item.address?.country || '',
      state: item.address?.state,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    }));
  } catch (error) {
    console.error('City search error:', error);
    throw error;
  }
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<{
  city: string;
  country: string;
}> {
  try {
    const response = await fetch(
      `${NOMINATIM_URL}/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'WeatherApp/1.0',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Reverse geocode API error:', response.status, errorText);
      throw new Error(`Failed to reverse geocode: ${response.status}`);
    }

    const data = await response.json();
    console.log('Reverse geocode response:', data);
    
    const city = data.address?.city || data.address?.town || data.address?.village || data.address?.municipality || data.name || 'Unknown Location';
    const country = data.address?.country || '';

    return {
      city,
      country,
    };
  } catch (error) {
    console.error('Reverse geocode error:', error);
    return {
      city: 'Unknown Location',
      country: '',
    };
  }
}
