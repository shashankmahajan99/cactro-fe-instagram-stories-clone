import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  // Text styles
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  username: {
    fontSize: 12,
    color: '#000',
  },
  whiteText: {
    color: '#fff',
  },
  
  // Layout styles
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  // Common avatar styles
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#fff',
  },
  smallAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  
  // Story ring
  storyRing: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: '#ff3b30',
  },
  
  // Common spacing
  marginSmall: {
    margin: 8,
  },
  paddingSmall: {
    padding: 8,
  },
  paddingMedium: {
    padding: 16,
  },
});
