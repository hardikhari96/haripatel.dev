# Festival Decorations System

This website now supports festive decorations that can be easily switched based on different festivals!

## How to Change Festival

Edit `/src/data/festival.json` and change the `currentFestival` value:

```json
{
  "currentFestival": "christmas"
}
```

## Available Festivals

### 🎅 Christmas
- **Value**: `"christmas"`
- **Decoration**: Santa emoji (🎅)
- **Snow Effect**: ✅ Enabled
- **Suggested Period**: December 1-31

### 🎊 New Year
- **Value**: `"newyear"`
- **Decoration**: Party popper emoji (🎊)
- **Snow Effect**: ❌ Disabled
- **Suggested Period**: January 1-7

### 🪔 Diwali
- **Value**: `"diwali"`
- **Decoration**: Diya lamp emoji (🪔)
- **Snow Effect**: ❌ Disabled
- **Suggested Period**: October 15 - November 15

### 🎃 Halloween
- **Value**: `"halloween"`
- **Decoration**: Pumpkin emoji (🎃)
- **Snow Effect**: ❌ Disabled
- **Suggested Period**: October 25-31

### None
- **Value**: `"none"`
- **Decoration**: None
- **Snow Effect**: ❌ Disabled
- **Use**: When you don't want any festival decorations

## Features

- **Animated Decorations**: Each festival has its own unique animation
  - Christmas: Wiggling Santa
  - Diwali: Glowing Diya
  - Halloween: Spooky shake
  - New Year: Party pop

- **Snow Effect**: Only enabled for Christmas (configurable per festival)

- **Accessibility**: Respects `prefers-reduced-motion` for users who prefer minimal animations

## Adding New Festivals

1. Add a new entry in `/src/data/festival.json`:
```json
"holi": {
  "name": "Holi",
  "emoji": "🎨",
  "startDate": "03-15",
  "endDate": "03-20",
  "enableSnow": false
}
```

2. Optionally add custom animation in `/src/components/FestiveDecoration.astro`:
```css
.festive-decoration[data-festival="holi"] {
  animation: color-splash 2s ease-in-out infinite;
}

@keyframes color-splash {
  0%, 100% {
    filter: hue-rotate(0deg);
  }
  50% {
    filter: hue-rotate(360deg);
  }
}
```

3. Update the festival type in `FestiveDecoration.astro`:
```typescript
interface Props {
  festival?: 'christmas' | 'diwali' | 'halloween' | 'newyear' | 'holi' | 'none';
}
```

Enjoy the festive vibes! 🎉
