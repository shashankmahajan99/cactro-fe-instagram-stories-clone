import { STORY_CONFIG } from '@/constants/StoryConfig';
import type { User } from '@/data/stories';
import { useStoryNavigation } from '@/hooks/useStoryNavigation';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    Modal,
    PanResponder,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProgressBar } from './ProgressBar';
import { TapZones } from './TapZones';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface StoryViewerProps {
  visible: boolean;
  user: User | null;
  users: User[];
  onClose: () => void;
  onUserChange?: (user: User) => void;
  initialStoryIndex?: number;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  visible,
  user,
  users,
  onClose,
  onUserChange,
  initialStoryIndex = 0,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [nextUser, setNextUser] = useState<User | null>(null);
  const [prevUser, setPrevUser] = useState<User | null>(null);
  
  const insets = useSafeAreaInsets();
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const { 
    currentStoryIndex, 
    goNext,
    goPrevious, 
    reset, 
    getCurrentStory 
  } = useStoryNavigation(user);

  // Find adjacent users
  useEffect(() => {
    if (user && users) {
      const currentIndex = users.findIndex(u => u.id === user.id);
      setNextUser(currentIndex < users.length - 1 ? users[currentIndex + 1] : null);
      setPrevUser(currentIndex > 0 ? users[currentIndex - 1] : null);
    }
  }, [user, users]);

  // Reset when user changes or component becomes visible
  useEffect(() => {
    if (visible && user) {
      reset();
      setImageLoaded(false);
      setIsPaused(false);
      translateX.setValue(0);
      translateY.setValue(0);
      opacity.setValue(1);
      scaleAnim.setValue(1);
    }
  }, [visible, user, reset, translateX, translateY, opacity, scaleAnim]);

  const animateUserTransition = (direction: 'left' | 'right', callback: () => void) => {
    const targetX = direction === 'left' ? -screenWidth : screenWidth;
    
    // First phase: slide out current user with smooth easing
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: targetX,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Change user
      callback();
      
      // Reset position for slide in animation
      translateX.setValue(-targetX); // Start from opposite side
      opacity.setValue(0);
      scaleAnim.setValue(0.95);
      
      // Second phase: slide in new user with spring animation
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      
      onPanResponderGrant: () => {
        setIsPaused(true);
      },
      
      onPanResponderMove: (evt, gestureState) => {
        translateY.setValue(gestureState.dy);
        translateX.setValue(gestureState.dx);
        
        // Adjust opacity and scale based on vertical movement
        if (gestureState.dy > 0) {
          const progress = Math.min(gestureState.dy / 300, 1);
          opacity.setValue(1 - progress * 0.5);
          scaleAnim.setValue(1 - progress * 0.2);
        }
      },
      
      onPanResponderRelease: (evt, gestureState) => {
        setIsPaused(false);
        
        const { dx, dy, vx, vy } = gestureState;
        
        // Swipe down to close
        if (dy > 100 || vy > 0.5) {
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: screenHeight,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 0.5,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onClose();
          });
          return;
        }
        
        // Swipe left - next user
        if ((dx < -80 || vx < -0.5) && nextUser) {
          animateUserTransition('left', () => {
            onUserChange?.(nextUser);
          });
          return;
        }
        
        // Swipe right - previous user
        if ((dx > 80 || vx > 0.5) && prevUser) {
          animateUserTransition('right', () => {
            onUserChange?.(prevUser);
          });
          return;
        }
        
        // Spring back to original position
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.spring(opacity, {
            toValue: 1,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start();
      },
    })
  ).current;

  const handleNext = () => {
    if (!goNext()) {
      if (nextUser) {
        animateUserTransition('left', () => {
          onUserChange?.(nextUser);
        });
      } else {
        handleClose();
      }
    } else {
      setImageLoaded(false);
    }
  };

  const handleLeftTap = () => {
    // Priority 1: Try to go to previous story in current user
    if (goPrevious()) {
      setImageLoaded(false);
    } else if (prevUser) {
      // Priority 2: If no previous story, go to previous user
      animateUserTransition('right', () => {
        onUserChange?.(prevUser);
      });
    }
    // If no previous story and no previous user, do nothing
  };

  const handleRightTap = () => {
    // Priority 1: Try to go to next story in current user
    if (goNext()) {
      setImageLoaded(false);
    } else if (nextUser) {
      // Priority 2: If no next story, go to next user
      animateUserTransition('left', () => {
        onUserChange?.(nextUser);
      });
    } else {
      // Priority 3: If no next story and no next user, close viewer
      handleClose();
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  if (!visible || !user) return null;

  const currentStory = getCurrentStory();
  if (!currentStory) return null;

  return (
    <Modal
      visible={visible}
      transparent={false}
      onRequestClose={handleClose}
      animationType="none"
    >
      <StatusBar hidden />
      <Animated.View 
        style={[
          styles.storyContainer,
          {
            opacity: opacity,
            transform: [
              { translateX: translateX },
              { translateY: translateY },
              { scale: scaleAnim },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Image
          source={currentStory.image}
          style={styles.storyImage}
          resizeMode="cover"
          onLoad={() => setImageLoaded(true)}
        />
        
        {!imageLoaded && (
          <View style={styles.loadingContainer}>
            <Animated.View style={[styles.loadingDot, styles.loadingDot1]} />
            <Animated.View style={[styles.loadingDot, styles.loadingDot2]} />
            <Animated.View style={[styles.loadingDot, styles.loadingDot3]} />
          </View>
        )}
        
        {/* Progress Bars */}
        <View style={[styles.progressContainer, { top: Math.max(insets.top + 10, 50) }]}>
          {user.stories.map((_, index) => (
            <ProgressBar
              key={`${user.id}-${index}`}
              duration={STORY_CONFIG.STORY_DURATION}
              isActive={index === currentStoryIndex && imageLoaded}
              isPaused={isPaused}
              isViewed={index < currentStoryIndex}
              onComplete={handleNext}
            />
          ))}
        </View>

        {/* User Info */}
        <View style={[styles.storyHeader, { top: Math.max(insets.top + 50, 90) }]}>
          <View style={styles.userInfo}>
            <Image source={user.avatar} style={styles.storyAvatar} />
            <Text style={styles.storyUsername}>{user.username}</Text>
          </View>
        </View>

        {/* Tap Zones */}
        <TapZones
          onLeftTap={handleLeftTap}
          onRightTap={handleRightTap}
          onCenterTap={togglePause}
          isPaused={isPaused}
        />
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  storyContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#000',
  },
  storyImage: {
    width: screenWidth,
    height: screenHeight,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    flexDirection: 'row',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
    opacity: 0.3,
  },
  loadingDot1: {
    opacity: 1,
  },
  loadingDot2: {
    opacity: 0.6,
  },
  loadingDot3: {
    opacity: 0.3,
  },
  progressContainer: {
    position: 'absolute',
    left: 8,
    right: 8,
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  storyHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storyAvatar: {
    width: STORY_CONFIG.SMALL_AVATAR_SIZE,
    height: STORY_CONFIG.SMALL_AVATAR_SIZE,
    borderRadius: STORY_CONFIG.SMALL_AVATAR_SIZE / 2,
    marginRight: 12,
  },
  storyUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
