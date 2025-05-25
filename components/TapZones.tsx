import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

interface TapZonesProps {
  onLeftTap: () => void;
  onRightTap: () => void;
  onCenterTap?: () => void;
  isPaused?: boolean;
}

export const TapZones: React.FC<TapZonesProps> = ({
  onLeftTap,
  onRightTap,
  onCenterTap,
  isPaused = false,
}) => {
  return (
    <View style={styles.container}>
      {/* Left Tap Zone (30% - Previous Story/User) */}
      <TouchableWithoutFeedback onPress={onLeftTap}>
        <View style={styles.leftZone} />
      </TouchableWithoutFeedback>

      {/* Center Tap Zone (40% - Pause/Play) */}
      {onCenterTap && (
        <TouchableWithoutFeedback onPress={onCenterTap}>
          <View style={styles.centerZone}>
            {isPaused && (
              <View style={styles.pauseIndicator}>
                <View style={styles.pauseBar} />
                <View style={styles.pauseBar} />
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* Right Tap Zone (30% or 70% - Next Story/User) */}
      <TouchableWithoutFeedback onPress={onRightTap}>
        <View style={[styles.rightZone, onCenterTap ? styles.rightZoneWithCenter : styles.rightZoneFullWidth]} />
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  leftZone: {
    flex: 0.3,
  },
  centerZone: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightZone: {
    // flex will be set based on whether center zone exists
  },
  rightZoneWithCenter: {
    flex: 0.3,
  },
  rightZoneFullWidth: {
    flex: 0.7,
  },
  pauseIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseBar: {
    width: 4,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 2,
    borderRadius: 2,
  },
});