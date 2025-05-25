import { STORY_CONFIG } from '@/constants/StoryConfig';
import type { User } from '@/data/stories';
import React from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StoryItemProps {
  user: User;
  scaleAnim?: Animated.Value;
  onPress: () => void;
}

export const StoryItem: React.FC<StoryItemProps> = ({ user, scaleAnim, onPress }) => {
  const containerStyle = scaleAnim 
    ? [styles.container, { transform: [{ scale: scaleAnim }] }]
    : styles.container;

  const Container = scaleAnim ? Animated.View : View;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1}>
      <Container style={containerStyle}>
        <View style={styles.avatarContainer}>
          <Image source={user.avatar} style={styles.avatar} />
          <View style={styles.storyRing} />
        </View>
        <Text style={styles.username}>{user.username}</Text>
      </Container>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: STORY_CONFIG.AVATAR_SIZE,
    height: STORY_CONFIG.AVATAR_SIZE,
    borderRadius: STORY_CONFIG.AVATAR_SIZE / 2,
    borderWidth: 3,
    borderColor: '#fff',
  },
  storyRing: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: (STORY_CONFIG.AVATAR_SIZE + 6) / 2,
    borderWidth: STORY_CONFIG.STORY_RING_WIDTH,
    borderColor: STORY_CONFIG.STORY_RING_COLOR,
  },
  username: {
    fontSize: 12,
    color: '#000',
  },
});
