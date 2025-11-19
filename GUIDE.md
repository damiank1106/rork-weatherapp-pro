# Weather App - Design & Code Guide

This guide provides comprehensive documentation on how the app's design is organized with screen-size specific configurations for **bigscreen** (iPhone 16 Pro Max), **smallscreen** (iPhone 15, 16, etc.), and **web** (iPad Pro, tablets, desktop browsers).

## Table of Contents
- [Screen Size System](#screen-size-system)
- [Colors](#colors)
- [Font Sizes](#font-sizes)
- [Icon Sizes](#icon-sizes)
- [Spacing](#spacing)
- [Border Radius](#border-radius)
- [Container Sizes](#container-sizes)
- [Component Reference](#component-reference)

---

## Screen Size System

All screen-size configurations are centralized in **`constants/screenSizes.ts`**.

### Screen Type Detection

The app automatically detects the device type based on screen width and platform:

- **bigscreen**: Width ≥ 430px (iPhone 16 Pro Max)
- **smallscreen**: Width < 430px (iPhone 15, 16, etc.)
- **web**: Platform is web OR width ≥ 768px (iPad Pro, tablets, desktop)

### Usage in Components

```typescript
import {
  getColors,
  getFontSizes,
  getIconSizes,
  getSpacing,
  getBorderRadius,
  getContainerSizes,
} from '@/constants/screenSizes';

const colors = getColors();
const fontSizes = getFontSizes();
const iconSizes = getIconSizes();
const spacing = getSpacing();
const borderRadius = getBorderRadius();
const containerSizes = getContainerSizes();
```

---

## Colors

Location: **`constants/screenSizes.ts`** → `COLORS` object

### Background Colors

#### bigscreen (iPhone 16 Pro Max)
```typescript
background: {
  primary: '#0f172a',    // Main background
  secondary: '#1e293b',  // Secondary surfaces
  tertiary: '#334155',   // Tertiary surfaces
}
```

#### smallscreen (iPhone 15, 16)
```typescript
background: {
  primary: '#0f172a',
  secondary: '#1e293b',
  tertiary: '#334155',
}
```

#### web (iPad Pro, Desktop)
```typescript
background: {
  primary: '#0f172a',
  secondary: '#1e293b',
  tertiary: '#334155',
}
```

### Text Colors

#### bigscreen
```typescript
text: {
  primary: '#ffffff',              // Main text
  secondary: 'rgba(255,255,255,0.8)',  // Secondary text
  tertiary: 'rgba(255,255,255,0.6)',   // Tertiary/muted text
}
```

#### smallscreen
```typescript
text: {
  primary: '#ffffff',
  secondary: 'rgba(255,255,255,0.8)',
  tertiary: 'rgba(255,255,255,0.6)',
}
```

#### web
```typescript
text: {
  primary: '#ffffff',
  secondary: 'rgba(255,255,255,0.8)',
  tertiary: 'rgba(255,255,255,0.6)',
}
```

### Card Colors

#### bigscreen
```typescript
card: {
  border: 'rgba(255,255,255,0.2)',     // Card border
  background: 'rgba(0,0,0,0.3)',       // Card background overlay
}
```

#### smallscreen
```typescript
card: {
  border: 'rgba(255,255,255,0.2)',
  background: 'rgba(0,0,0,0.3)',
}
```

#### web
```typescript
card: {
  border: 'rgba(255,255,255,0.2)',
  background: 'rgba(0,0,0,0.3)',
}
```

### Accent Colors

#### bigscreen
```typescript
accent: {
  blue: '#60a5fa',    // Primary accent (links, active states)
  yellow: '#fbbf24',  // Warning/highlight
  red: '#ef4444',     // Error/danger
  green: '#22c55e',   // Success
}
```

#### smallscreen
```typescript
accent: {
  blue: '#60a5fa',
  yellow: '#fbbf24',
  red: '#ef4444',
  green: '#22c55e',
}
```

#### web
```typescript
accent: {
  blue: '#60a5fa',
  yellow: '#fbbf24',
  red: '#ef4444',
  green: '#22c55e',
}
```

---

## Font Sizes

Location: **`constants/screenSizes.ts`** → `FONT_SIZES` object

### bigscreen (iPhone 16 Pro Max)
```typescript
{
  title: 96,      // Main temperature display
  subtitle: 20,   // Weather description
  body: 18,       // Regular text
  small: 16,      // Small text
  tiny: 14,       // Very small text
  mini: 12,       // Smallest text (labels, captions)
}
```

### smallscreen (iPhone 15, 16)
```typescript
{
  title: 72,      // Smaller main temperature
  subtitle: 18,   // Weather description
  body: 16,       // Regular text
  small: 14,      // Small text
  tiny: 12,       // Very small text
  mini: 10,       // Smallest text
}
```

### web (iPad Pro, Desktop)
```typescript
{
  title: 96,      // Same as bigscreen
  subtitle: 22,   // Slightly larger
  body: 18,       // Regular text
  small: 16,      // Small text
  tiny: 14,       // Very small text
  mini: 12,       // Smallest text
}
```

---

## Icon Sizes

Location: **`constants/screenSizes.ts`** → `ICON_SIZES` object

### bigscreen (iPhone 16 Pro Max)
```typescript
{
  large: 64,      // Weather icons
  medium: 32,     // Feature icons
  small: 24,      // Navigation icons
  tiny: 20,       // Small UI icons
  mini: 16,       // Smallest icons
}
```

### smallscreen (iPhone 15, 16)
```typescript
{
  large: 56,      // Slightly smaller weather icons
  medium: 28,     // Feature icons
  small: 20,      // Navigation icons
  tiny: 18,       // Small UI icons
  mini: 14,       // Smallest icons
}
```

### web (iPad Pro, Desktop)
```typescript
{
  large: 64,      // Same as bigscreen
  medium: 32,     // Feature icons
  small: 24,      // Navigation icons
  tiny: 20,       // Small UI icons
  mini: 16,       // Smallest icons
}
```

---

## Spacing

Location: **`constants/screenSizes.ts`** → `SPACING` object

### bigscreen (iPhone 16 Pro Max)
```typescript
{
  container: 20,  // Horizontal container padding
  card: 16,       // Card inner padding
  section: 32,    // Section gaps
  item: 12,       // Item gaps
  small: 8,       // Small gaps
  tiny: 4,        // Tiny gaps
}
```

### smallscreen (iPhone 15, 16)
```typescript
{
  container: 16,  // Tighter container padding
  card: 12,       // Tighter card padding
  section: 24,    // Smaller section gaps
  item: 10,       // Smaller item gaps
  small: 6,       // Small gaps
  tiny: 4,        // Tiny gaps
}
```

### web (iPad Pro, Desktop)
```typescript
{
  container: 24,  // More spacious padding
  card: 20,       // More card padding
  section: 40,    // Larger section gaps
  item: 16,       // Larger item gaps
  small: 8,       // Small gaps
  tiny: 4,        // Tiny gaps
}
```

---

## Border Radius

Location: **`constants/screenSizes.ts`** → `BORDER_RADIUS` object

### bigscreen (iPhone 16 Pro Max)
```typescript
{
  card: 20,       // Card corners
  button: 16,     // Button corners
  small: 12,      // Small element corners
  tiny: 8,        // Tiny element corners
}
```

### smallscreen (iPhone 15, 16)
```typescript
{
  card: 16,       // Slightly smaller card corners
  button: 12,     // Button corners
  small: 10,      // Small element corners
  tiny: 6,        // Tiny element corners
}
```

### web (iPad Pro, Desktop)
```typescript
{
  card: 24,       // Larger card corners
  button: 20,     // Larger button corners
  small: 16,      // Small element corners
  tiny: 8,        // Tiny element corners
}
```

---

## Container Sizes

Location: **`constants/screenSizes.ts`** → `CONTAINER_SIZES` object

### bigscreen (iPhone 16 Pro Max)
```typescript
{
  headerHeight: 100,           // Top header height
  tabBarHeight: 80,            // Bottom tab bar height
  cardWidth: (width - 56) / 2, // Width of detail cards (2 columns)
  hourlyItemWidth: 60,         // Width of hourly forecast items
  dailyDayWidth: 60,           // Width of daily day labels
}
```

### smallscreen (iPhone 15, 16)
```typescript
{
  headerHeight: 80,            // Smaller header
  tabBarHeight: 70,            // Smaller tab bar
  cardWidth: (width - 48) / 2, // Adjusted card width
  hourlyItemWidth: 50,         // Narrower hourly items
  dailyDayWidth: 50,           // Narrower day labels
}
```

### web (iPad Pro, Desktop)
```typescript
{
  headerHeight: 100,           // Same as bigscreen
  tabBarHeight: 80,            // Same as bigscreen
  cardWidth: (width - 64) / 2, // Wider card width
  hourlyItemWidth: 70,         // Wider hourly items
  dailyDayWidth: 70,           // Wider day labels
}
```

---

## Component Reference

### 1. Weather Home Screen (`app/(tabs)/index.tsx`)

#### Layout Structure
- **Container**: Full screen with gradient background
- **Header**: Floating header with blur effect (100px height for bigscreen/web, 80px for smallscreen)
- **Main Content**: Centered location, temperature, and weather icon
- **Cards Section**: AI Brief, Hourly Forecast, 7-Day Forecast, Detail Cards

#### Key Styles by Screen Size

##### Main Temperature Display
- **bigscreen**: 96px font size
- **smallscreen**: 72px font size
- **web**: 96px font size

##### Cards Container
- **bigscreen/smallscreen/web**: 20px/16px/24px horizontal padding
- **Card border radius**: 20px/16px/24px

##### Detail Cards Grid
- **bigscreen**: (width - 56) / 2 per card
- **smallscreen**: (width - 48) / 2 per card
- **web**: (width - 64) / 2 per card

### 2. Map Screen (`app/(tabs)/map.tsx`)

#### Layout Structure
- **Container**: Full screen native map
- **Controls**: Top-right radar toggle
- **Playback Controls**: Bottom-left play/pause/stop buttons
- **Location Info**: Top center location card

#### Playback Animation
- **Total Frames**: 72 (6 hours × 12 five-minute intervals)
- **Update Interval**: 5 seconds per frame
- **Frame Display**: Shows "+Xh Ym" format

#### Key Elements
- **Control Buttons**: 56px circular buttons with blur background
- **Frame Info**: Displays current forecast time offset
- **Location Card**: Blur card with city name and current weather

### 3. Alerts Screen (`app/(tabs)/alerts.tsx`)

#### Layout Structure
- **Header**: Page title and location
- **Alert Cards**: List of weather alerts with severity indicators
- **No Alerts State**: Info card when no alerts are active

#### Severity Colors
- **Extreme**: #dc2626 (red)
- **Severe**: #ea580c (orange)
- **Moderate**: #f59e0b (amber)
- **Minor**: #3b82f6 (blue)

#### Card Structure
- **Severity Indicator**: 40px circular icon with colored background
- **Alert Content**: Event name, sender, description, time range
- **Tags**: Severity tags with colored backgrounds

### 4. Settings Screen (`app/(tabs)/settings.tsx`)

#### Layout Structure
- **Header**: Page title
- **Sections**: Grouped settings cards
- **Footer**: App information

#### Settings Sections
1. **UNITS**
   - Temperature Unit display
   - Use Metric System toggle
   - Speed Unit display
   - Pressure Unit display

2. **ABOUT**
   - Data Source
   - Version

#### Switch Component
- **Track Color (false)**: #475569
- **Track Color (true)**: #60a5fa
- **Thumb Color**: #fff

### 5. Tab Bar (`app/(tabs)/_layout.tsx`)

#### Configuration
- **Background Color**: colors.background.primary (#0f172a)
- **Border Top Color**: colors.background.secondary (#1e293b)
- **Active Tint**: colors.accent.blue (#60a5fa)
- **Inactive Tint**: colors.text.tertiary (rgba(255,255,255,0.6))

#### Tab Bar Heights
- **bigscreen**: 80px
- **smallscreen**: 70px
- **web**: 80px

---

## How to Modify Styles for Different Screen Sizes

### Step 1: Locate the Constants File
Open **`constants/screenSizes.ts`**

### Step 2: Find the Property to Modify
Navigate to the appropriate section (COLORS, FONT_SIZES, ICON_SIZES, SPACING, BORDER_RADIUS, or CONTAINER_SIZES)

### Step 3: Update Values for Each Screen Type

Example - Change main temperature font size:
```typescript
export const FONT_SIZES = {
  bigscreen: {
    title: 108, // Changed from 96 to 108
    // ... rest of properties
  },
  smallscreen: {
    title: 80, // Changed from 72 to 80
    // ... rest of properties
  },
  web: {
    title: 120, // Changed from 96 to 120
    // ... rest of properties
  },
};
```

### Step 4: Save and Test
The changes will automatically apply across all components that use the screen size helpers.

---

## Quick Reference Table

| Element | bigscreen | smallscreen | web | Location |
|---------|-----------|-------------|-----|----------|
| **Main Temperature** | 96px | 72px | 96px | index.tsx |
| **Weather Icon** | 64px | 56px | 64px | index.tsx |
| **Card Border Radius** | 20px | 16px | 24px | All screens |
| **Container Padding** | 20px | 16px | 24px | All screens |
| **Header Height** | 100px | 80px | 100px | All screens |
| **Tab Bar Height** | 80px | 70px | 80px | _layout.tsx |
| **Detail Card Width** | (width-56)/2 | (width-48)/2 | (width-64)/2 | index.tsx |
| **Hourly Item Width** | 60px | 50px | 70px | index.tsx |
| **Primary Background** | #0f172a | #0f172a | #0f172a | All screens |
| **Accent Blue** | #60a5fa | #60a5fa | #60a5fa | All screens |

---

## Color Codes Reference

### Background Gradients
- **Primary**: #0f172a (Slate 900)
- **Secondary**: #1e293b (Slate 800)
- **Tertiary**: #334155 (Slate 700)

### Text Colors
- **Primary**: #ffffff (White)
- **Secondary**: rgba(255,255,255,0.8) (80% White)
- **Tertiary**: rgba(255,255,255,0.6) (60% White)

### Accent Colors
- **Blue**: #60a5fa (Primary accent, links, active states)
- **Yellow**: #fbbf24 (AI features, warnings)
- **Red**: #ef4444 (Errors, severe alerts)
- **Green**: #22c55e (Success states)

### Alert Severity Colors
- **Extreme**: #dc2626 (Red 600)
- **Severe**: #ea580c (Orange 600)
- **Moderate**: #f59e0b (Amber 500)
- **Minor**: #3b82f6 (Blue 500)

---

## File Structure

```
constants/
  └── screenSizes.ts         # All screen size configurations

app/(tabs)/
  ├── _layout.tsx            # Tab bar configuration
  ├── index.tsx              # Weather home screen
  ├── map.tsx                # Map screen with radar
  ├── alerts.tsx             # Alerts screen
  └── settings.tsx           # Settings screen

components/
  ├── AIBriefCard.tsx        # AI weather brief component
  ├── NativeMap.native.tsx   # Native map for mobile
  └── NativeMap.web.tsx      # Web map placeholder

contexts/
  └── WeatherContext.tsx     # Weather state management

utils/
  ├── weatherApi.ts          # Weather API calls
  └── weatherHelpers.ts      # Weather formatting utilities
```

---

## Tips for Maintenance

1. **Always update all three screen types** (bigscreen, smallscreen, web) when changing values
2. **Use the helper functions** (getColors(), getFontSizes(), etc.) instead of hardcoding values
3. **Test on multiple devices** to ensure consistent experience
4. **Keep ratios proportional** when adjusting sizes across screen types
5. **Document any custom overrides** in component files with comments

---

## Support

For questions or issues related to screen size configurations, refer to:
- **Constants File**: `constants/screenSizes.ts`
- **This Guide**: `GUIDE.md`
- **Component Files**: `app/(tabs)/*.tsx`
