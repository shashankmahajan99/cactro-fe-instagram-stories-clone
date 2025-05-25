import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

interface CacheEntry {
  url: string;
  localPath: string;
  timestamp: number;
}

class ImageCacheService {
  private cacheDir: string;
  private maxCacheAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  private cacheIndexKey = 'IMAGE_CACHE_INDEX';

  constructor() {
    this.cacheDir = `${RNFS.DocumentDirectoryPath}/image_cache`;
    this.initializeCache();
  }

  private async initializeCache(): Promise<void> {
    try {
      const exists = await RNFS.exists(this.cacheDir);
      if (!exists) {
        await RNFS.mkdir(this.cacheDir);
      }
    } catch (error) {
      console.warn('Failed to initialize image cache:', error);
    }
  }

  private async getCacheIndex(): Promise<Record<string, CacheEntry>> {
    try {
      const indexJson = await AsyncStorage.getItem(this.cacheIndexKey);
      return indexJson ? JSON.parse(indexJson) : {};
    } catch (error) {
      console.warn('Failed to get cache index:', error);
      return {};
    }
  }

  private async updateCacheIndex(index: Record<string, CacheEntry>): Promise<void> {
    try {
      await AsyncStorage.setItem(this.cacheIndexKey, JSON.stringify(index));
    } catch (error) {
      console.warn('Failed to update cache index:', error);
    }
  }

  private getFileNameFromUrl(url: string): string {
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1] || 'image';
    const cleanFileName = fileName.split('?')[0];
    return cleanFileName.includes('.') ? cleanFileName : `${cleanFileName}.jpg`;
  }

  private async isExpired(timestamp: number): Promise<boolean> {
    const now = Date.now();
    return (now - timestamp) > this.maxCacheAge;
  }

  async getCachedImagePath(url: string): Promise<string> {
    try {
      const index = await this.getCacheIndex();
      const cacheEntry = index[url];

      // Check if we have a cached version
      if (cacheEntry) {
        const exists = await RNFS.exists(cacheEntry.localPath);
        const expired = await this.isExpired(cacheEntry.timestamp);

        if (exists && !expired) {
          return Platform.OS === 'android' 
            ? `file://${cacheEntry.localPath}` 
            : cacheEntry.localPath;
        }

        // Clean up expired entry
        if (exists) {
          await RNFS.unlink(cacheEntry.localPath).catch(() => {});
        }
        delete index[url];
        await this.updateCacheIndex(index);
      }

      // Download and cache the image
      const fileName = this.getFileNameFromUrl(url);
      const localPath = `${this.cacheDir}/${Date.now()}_${fileName}`;

      await RNFS.downloadFile({
        fromUrl: url,
        toFile: localPath,
        discretionary: true,
        cacheable: true,
      }).promise;

      // Update cache index
      const newEntry: CacheEntry = {
        url,
        localPath,
        timestamp: Date.now(),
      };
      
      index[url] = newEntry;
      await this.updateCacheIndex(index);

      return Platform.OS === 'android' ? `file://${localPath}` : localPath;
    } catch (error) {
      console.warn(`Failed to cache image ${url}:`, error);
      return url; // Fallback to original URL
    }
  }

  async preloadImages(urls: string[]): Promise<void> {
    try {
      const promises = urls.map(url => this.getCachedImagePath(url));
      await Promise.allSettled(promises);
    } catch (error) {
      console.warn('Failed to preload images:', error);
    }
  }

  async clearCache(): Promise<void> {
    try {
      const exists = await RNFS.exists(this.cacheDir);
      if (exists) {
        await RNFS.unlink(this.cacheDir);
        await RNFS.mkdir(this.cacheDir);
      }
      await AsyncStorage.removeItem(this.cacheIndexKey);
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  async getCacheSize(): Promise<number> {
    try {
      const files = await RNFS.readDir(this.cacheDir);
      let totalSize = 0;
      
      for (const file of files) {
        totalSize += file.size || 0;
      }
      
      return totalSize;
    } catch (error) {
      console.warn('Failed to get cache size:', error);
      return 0;
    }
  }
}

export const imageCache = new ImageCacheService();
