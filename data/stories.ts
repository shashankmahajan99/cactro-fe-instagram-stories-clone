export interface Story {
  id: number;
  image: any; // Changed to support both require() and string URLs
}

export interface User {
  id: number;
  username: string;
  avatar: any; // Changed to support both require() and string URLs
  stories: Story[];
}

export const storiesData: User[] = [
  {
    id: 1,
    username: 'Sophia',
    avatar: require('@/assets/images/avatars/avatar_1.jpg'),
    stories: [
      { id: 1, image: require('@/assets/images/stories/story_1_1.jpg') },
      { id: 2, image: require('@/assets/images/stories/story_1_2.jpg') },
      { id: 3, image: require('@/assets/images/stories/story_1_3.jpg') },
    ]
  },
  {
    id: 2,
    username: 'Ethan',
    avatar: require('@/assets/images/avatars/avatar_2.jpg'),
    stories: [
      { id: 1, image: require('@/assets/images/stories/story_2_1.jpg') },
      { id: 2, image: require('@/assets/images/stories/story_2_2.jpg') },
    ]
  },
  {
    id: 3,
    username: 'Olivia',
    avatar: require('@/assets/images/avatars/avatar_3.jpg'),
    stories: [
      { id: 1, image: require('@/assets/images/stories/story_3_1.jpg') },
      { id: 2, image: require('@/assets/images/stories/story_3_2.jpg') },
      { id: 3, image: require('@/assets/images/stories/story_3_3.jpg') },
      { id: 4, image: require('@/assets/images/stories/story_3_4.jpg') },
    ]
  },
  {
    id: 4,
    username: 'Noah',
    avatar: require('@/assets/images/avatars/avatar_4.jpg'),
    stories: [
      { id: 1, image: require('@/assets/images/stories/story_4_1.jpg') },
    ]
  },
  {
    id: 5,
    username: 'Ava',
    avatar: require('@/assets/images/avatars/avatar_5.jpg'),
    stories: [
      { id: 1, image: require('@/assets/images/stories/story_5_1.jpg') },
      { id: 2, image: require('@/assets/images/stories/story_5_2.jpg') },
    ]
  },
  {
    id: 6,
    username: 'Liam',
    avatar: require('@/assets/images/avatars/avatar_6.jpg'),
    stories: [
      { id: 1, image: require('@/assets/images/stories/story_6_1.jpg') },
      { id: 2, image: require('@/assets/images/stories/story_6_2.jpg') },
      { id: 3, image: require('@/assets/images/stories/story_6_3.jpg') },
    ]
  },
];