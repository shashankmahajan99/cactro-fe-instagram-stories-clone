# Instagram Stories Feature

This is a React Native Expo app that implements a simplified version of Instagram Stories.

## Features

- 📱 **Mobile-first design** - Optimized specifically for mobile devices
- 🖼️ **Image stories** - View a collection of image-based stories
- 📊 **External data source** - Stories are loaded from external JSON data
- 🎯 **Tap navigation** - Tap left/right sides to navigate between stories
- ⏱️ **Auto-advance** - Stories automatically advance after 5 seconds
- 📈 **Progress indicators** - Visual progress bars show story advancement
- 🎨 **Smooth animations** - Fade transitions and progress animations

## Project Structure

```
components/
├── ProgressBar.tsx      # Individual story progress indicator
├── StoriesList.tsx      # Horizontal scrollable list of story avatars
├── StoryHeader.tsx      # Story viewer header with user info and close button
├── StoryItem.tsx        # Individual story avatar item in the list
├── StoryViewer.tsx      # Full-screen story viewer modal
└── TapZones.tsx         # Invisible tap zones for story navigation

constants/
├── StoryConfig.ts       # Configuration constants for stories
└── Styles.ts            # Shared style definitions

data/
└── stories.ts           # Story data with TypeScript interfaces

hooks/
└── useStoryNavigation.ts # Custom hook for story navigation logic
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Open the app on your device using:
   - [Expo Go](https://expo.dev/go) app (scan QR code)
   - iOS Simulator
   - Android Emulator

## How to Use

1. **View Stories**: Tap on any user avatar in the horizontal list to start viewing their stories
2. **Navigate**: 
   - Tap the right side of the screen to go to the next story
   - Tap the left side to go to the previous story
   - Close by tapping the X button
3. **Auto-advance**: Stories automatically move to the next one after 5 seconds
4. **Progress**: Watch the progress bars at the top to see story advancement

## Customization

### Adding New Stories

Edit `data/stories.ts` to add new users and their stories:

```typescript
{
  id: 6,
  username: 'NewUser',
  avatar: 'https://example.com/avatar.jpg',
  stories: [
    { id: 1, image: 'https://example.com/story1.jpg' },
    { id: 2, image: 'https://example.com/story2.jpg' },
  ]
}
```

### Modifying Story Duration

Change the auto-advance timing in `constants/StoryConfig.ts`:

```typescript
STORY_DURATION: 5000, // milliseconds
```

### Styling

All visual constants are centralized in:
- `constants/StoryConfig.ts` - Functional configurations
- `constants/Styles.ts` - Reusable style definitions

## Architecture

This app follows a modular architecture with:

- **Separation of Concerns**: Each component has a single responsibility
- **Custom Hooks**: Business logic extracted into reusable hooks
- **TypeScript**: Full type safety with interfaces for data structures
- **Configuration-driven**: Easy customization through config files
- **Clean Code**: Focused, maintainable components without boilerplate

## Tech Stack

- **React Native** - Mobile app framework
- **Expo** - Development and build platform
- **TypeScript** - Type safety and better developer experience
- **React Navigation** - Navigation (minimal setup for single screen app)

## Requirements Met

✅ Mobile-only design (no desktop support)  
✅ Horizontal scrollable story list  
✅ External data source (JSON file)  
✅ Story viewer with full-screen experience  
✅ Manual navigation (tap left/right)  
✅ Auto-advance after 5 seconds  
✅ Progress indicators  
✅ No external libraries for core functionality  
✅ Smooth transitions and animations
