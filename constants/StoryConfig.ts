export const STORY_CONFIG = {
  // Duration for each story in milliseconds
  STORY_DURATION: 5000,
  
  // Animation durations
  FADE_DURATION: 200,
  
  // UI measurements
  AVATAR_SIZE: 70,
  SMALL_AVATAR_SIZE: 32,
  STORY_RING_WIDTH: 2,
  PROGRESS_BAR_HEIGHT: 2,
  
  // Colors
  STORY_RING_COLOR: '#ff3b30',
  PROGRESS_BAR_BACKGROUND: 'rgba(255, 255, 255, 0.3)',
  PROGRESS_BAR_FILL: '#fff',
  
  // Safe area offsets
  TOP_SAFE_AREA: 50,
  HEADER_TOP_OFFSET: 60,
  
  // Touch zones
  TAP_ZONE_RATIO: 0.5, // Each tap zone takes 50% of screen width
} as const;
