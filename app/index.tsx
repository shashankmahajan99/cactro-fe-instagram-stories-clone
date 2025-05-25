import { StoriesList } from '@/components/StoriesList';
import { StoryViewer } from '@/components/StoryViewer';
import type { User } from '@/data/stories';
import { storiesData } from '@/data/stories';
import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function InstagramStories() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [storyViewerVisible, setStoryViewerVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const handleUserPress = (user: User) => {
    setSelectedUser(user);
    setStoryViewerVisible(true);
  };

  const handleCloseStoryViewer = () => {
    setStoryViewerVisible(false);
    setTimeout(() => setSelectedUser(null), 200);
  };

  const handleUserChange = (newUser: User) => {
    setSelectedUser(newUser);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 12 }]}>
        <Text style={styles.headerTitle}>Stories</Text>
      </View>
      
      <StoriesList users={storiesData} onUserPress={handleUserPress} />

      <StoryViewer
        visible={storyViewerVisible}
        user={selectedUser}
        users={storiesData}
        onClose={handleCloseStoryViewer}
        onUserChange={handleUserChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
});