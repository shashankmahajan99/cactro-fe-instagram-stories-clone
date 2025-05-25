import { STORY_CONFIG } from '@/constants/StoryConfig';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface ProgressBarProps {
  duration: number;
  isActive: boolean;
  isPaused?: boolean;
  isViewed?: boolean;
  onComplete?: () => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  duration, 
  isActive, 
  isPaused = false,
  isViewed = false,
  onComplete 
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const pausedProgressRef = useRef(0);

  useEffect(() => {
    if (isViewed) {
      // If story is viewed, show full progress
      progressAnim.setValue(1);
      return;
    }

    if (isActive && !isPaused) {
      if (pausedProgressRef.current === 0) {
        progressAnim.setValue(0);
      }
      
      animationRef.current = Animated.timing(progressAnim, {
        toValue: 1,
        duration: duration * (1 - pausedProgressRef.current),
        useNativeDriver: false,
      });
      
      animationRef.current.start(({ finished }) => {
        if (finished) {
          pausedProgressRef.current = 0;
          if (onComplete) {
            onComplete();
          }
        }
      });
    } else if (isPaused && animationRef.current) {
      animationRef.current.stop();
      progressAnim.stopAnimation((value) => {
        pausedProgressRef.current = value;
      });
    } else if (!isActive) {
      progressAnim.setValue(0);
      pausedProgressRef.current = 0;
      if (animationRef.current) {
        animationRef.current.stop();
      }
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [isActive, isPaused, isViewed, duration, progressAnim, onComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <Animated.View
        style={[
          styles.fill,
          {
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: STORY_CONFIG.PROGRESS_BAR_HEIGHT,
    marginHorizontal: 2,
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: STORY_CONFIG.PROGRESS_BAR_HEIGHT,
    backgroundColor: STORY_CONFIG.PROGRESS_BAR_BACKGROUND,
    borderRadius: 1,
  },
  fill: {
    height: STORY_CONFIG.PROGRESS_BAR_HEIGHT,
    backgroundColor: STORY_CONFIG.PROGRESS_BAR_FILL,
    borderRadius: 1,
  },
});
