import { generateText } from '@rork-ai/toolkit-sdk';
import { CurrentWeather, DailyForecast } from '@/types/weather';

export async function generateDailyBrief(
  location: string,
  current: CurrentWeather,
  daily: DailyForecast,
  units: 'metric' | 'imperial'
): Promise<string> {
  try {
    const tempUnit = units === 'metric' ? '°C' : '°F';
    const speedUnit = units === 'metric' ? 'km/h' : 'mph';

    const facts = `
Location: ${location}
Current Temperature: ${Math.round(current.temp)}${tempUnit}
Feels Like: ${Math.round(current.feelsLike)}${tempUnit}
Today's High: ${Math.round(daily.temp.max)}${tempUnit}
Today's Low: ${Math.round(daily.temp.min)}${tempUnit}
Conditions: ${current.weather[0].description}
Wind Speed: ${Math.round(current.windSpeed)} ${speedUnit}
Humidity: ${current.humidity}%
Precipitation Chance: ${Math.round(daily.pop * 100)}%
UV Index: ${current.uvi || 0}
${current.weather[0].main === 'Rain' ? 'Rain expected' : ''}
${current.windSpeed > 20 ? 'Notable winds' : ''}
`;

    const prompt = `You are a concise weather explainer. Summarize today's weather for ${location}, using these facts: ${facts}. 
Write 2-3 sentences maximum. Include temperatures, precipitation risk, and notable conditions. 
Be conversational and helpful, like a friendly weather forecaster.`;

    const summary = await generateText(prompt);
    return summary;
  } catch (error) {
    console.error('Failed to generate weather brief:', error);
    return `Today in ${location}: ${Math.round(current.temp)}° with ${current.weather[0].description}. High of ${Math.round(daily.temp.max)}°, low of ${Math.round(daily.temp.min)}°.`;
  }
}

export async function explainAlert(alertDescription: string): Promise<string> {
  try {
    const prompt = `Rewrite this official weather alert in plain language with clear action steps for a non-expert. 
Keep it brief (2-3 sentences maximum). Preserve critical details but make it easy to understand what to do.

Alert: ${alertDescription}`;

    const explanation = await generateText(prompt);
    return explanation;
  } catch (error) {
    console.error('Failed to explain alert:', error);
    return alertDescription;
  }
}
