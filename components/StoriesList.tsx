import type { User } from '@/data/stories';
import React, { useRef } from 'react';
import { Animated, ScrollView, StyleSheet } from 'react-native';
import { StoryItem } from './StoryItem';

interface StoriesListProps {
  users: User[];
  onUserPress: (user: User) => void;
}

export const StoriesList: React.FC<StoriesListProps> = ({ users, onUserPress }) => {
  const scaleAnims = useRef(users.map(() => new Animated.Value(1))).current;

  const handleUserPress = (user: User, index: number) => {
    // Animate press
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onUserPress(user);
    });
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {users.map((user, index) => (
        <StoryItem
          key={user.id}
          user={user}
          scaleAnim={scaleAnims[index]}
          onPress={() => handleUserPress(user, index)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
});
