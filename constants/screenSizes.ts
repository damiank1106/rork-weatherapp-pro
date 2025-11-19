import { Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const SCREEN_TYPES = {
  bigscreen: 'bigscreen',
  smallscreen: 'smallscreen', 
  web: 'web',
} as const;

export type ScreenType = typeof SCREEN_TYPES[keyof typeof SCREEN_TYPES];

export function getScreenType(): ScreenType {
  if (Platform.OS === 'web' || width >= 768) {
    return SCREEN_TYPES.web;
  }
  if (width >= 430) {
    return SCREEN_TYPES.bigscreen;
  }
  return SCREEN_TYPES.smallscreen;
}

const screenType = getScreenType();

export const COLORS = {
  bigscreen: {
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255,255,255,0.8)',
      tertiary: 'rgba(255,255,255,0.6)',
    },
    card: {
      border: 'rgba(255,255,255,0.2)',
      background: 'rgba(0,0,0,0.3)',
    },
    accent: {
      blue: '#60a5fa',
      yellow: '#fbbf24',
      red: '#ef4444',
      green: '#22c55e',
    },
  },
  smallscreen: {
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255,255,255,0.8)',
      tertiary: 'rgba(255,255,255,0.6)',
    },
    card: {
      border: 'rgba(255,255,255,0.2)',
      background: 'rgba(0,0,0,0.3)',
    },
    accent: {
      blue: '#60a5fa',
      yellow: '#fbbf24',
      red: '#ef4444',
      green: '#22c55e',
    },
  },
  web: {
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255,255,255,0.8)',
      tertiary: 'rgba(255,255,255,0.6)',
    },
    card: {
      border: 'rgba(255,255,255,0.2)',
      background: 'rgba(0,0,0,0.3)',
    },
    accent: {
      blue: '#60a5fa',
      yellow: '#fbbf24',
      red: '#ef4444',
      green: '#22c55e',
    },
  },
};

export const FONT_SIZES = {
  bigscreen: {
    title: 96,
    subtitle: 20,
    body: 18,
    small: 16,
    tiny: 14,
    mini: 12,
  },
  smallscreen: {
    title: 72,
    subtitle: 18,
    body: 16,
    small: 14,
    tiny: 12,
    mini: 10,
  },
  web: {
    title: 96,
    subtitle: 22,
    body: 18,
    small: 16,
    tiny: 14,
    mini: 12,
  },
};

export const ICON_SIZES = {
  bigscreen: {
    large: 64,
    medium: 32,
    small: 24,
    tiny: 20,
    mini: 16,
  },
  smallscreen: {
    large: 56,
    medium: 28,
    small: 20,
    tiny: 18,
    mini: 14,
  },
  web: {
    large: 64,
    medium: 32,
    small: 24,
    tiny: 20,
    mini: 16,
  },
};

export const SPACING = {
  bigscreen: {
    container: 20,
    card: 16,
    section: 32,
    item: 12,
    small: 8,
    tiny: 4,
  },
  smallscreen: {
    container: 16,
    card: 12,
    section: 24,
    item: 10,
    small: 6,
    tiny: 4,
  },
  web: {
    container: 24,
    card: 20,
    section: 40,
    item: 16,
    small: 8,
    tiny: 4,
  },
};

export const BORDER_RADIUS = {
  bigscreen: {
    card: 20,
    button: 16,
    small: 12,
    tiny: 8,
  },
  smallscreen: {
    card: 16,
    button: 12,
    small: 10,
    tiny: 6,
  },
  web: {
    card: 24,
    button: 20,
    small: 16,
    tiny: 8,
  },
};

export const CONTAINER_SIZES = {
  bigscreen: {
    headerHeight: 100,
    tabBarHeight: 80,
    cardWidth: (width - 56) / 2,
    hourlyItemWidth: 60,
    dailyDayWidth: 60,
  },
  smallscreen: {
    headerHeight: 80,
    tabBarHeight: 90,
    cardWidth: (width - 48) / 2,
    hourlyItemWidth: 50,
    dailyDayWidth: 50,
  },
  web: {
    headerHeight: 100,
    tabBarHeight: 80,
    cardWidth: (width - 64) / 2,
    hourlyItemWidth: 70,
    dailyDayWidth: 70,
  },
};

export function getColors() {
  return COLORS[screenType];
}

export function getFontSizes() {
  return FONT_SIZES[screenType];
}

export function getIconSizes() {
  return ICON_SIZES[screenType];
}

export function getSpacing() {
  return SPACING[screenType];
}

export function getBorderRadius() {
  return BORDER_RADIUS[screenType];
}

export function getContainerSizes() {
  return CONTAINER_SIZES[screenType];
}
