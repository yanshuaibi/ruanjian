import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

const TAB_ICONS = {
  今日: '🔲',
  应用: '📦',
  私信: '💬',
  我的: '👤',
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const BAR_WIDTH = SCREEN_WIDTH * 0.92;
const TAB_COUNT = 4;
const SLOT_WIDTH = BAR_WIDTH / TAB_COUNT;
const PILL_WIDTH = SLOT_WIDTH - 14;

export default function CustomTabBar({ state, descriptors, navigation }) {
  const pillX = useRef(new Animated.Value(state.index * SLOT_WIDTH + 7)).current;

  useEffect(() => {
    Animated.spring(pillX, {
      toValue: state.index * SLOT_WIDTH + 7,
      useNativeDriver: true,
      speed: 16,
      bounciness: 8,
    }).start();
  }, [state.index]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.shadowBox}>
        <BlurView
          intensity={45}
          tint="light"
          experimentalBlurMethod="dimezisBlurView"
          style={styles.bar}
        >
          <View style={styles.glassOverlay} />
          <Animated.View
            style={[
              styles.pill,
              { transform: [{ translateX: pillX }] },
            ]}
          />
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={0.7}
                style={styles.tabBtn}
              >
                <Text style={[styles.icon, isFocused && styles.iconActive]}>
                  {TAB_ICONS[route.name]}
                </Text>
                <Text style={[styles.label, isFocused && styles.labelActive]}>
                  {route.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 18,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  shadowBox: {
    width: BAR_WIDTH,
    height: 64,
    borderRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#2a6ca7',
        shadowOpacity: 0.2,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 12,
      },
    }),
  },
  bar: {
    flex: 1,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  pill: {
    position: 'absolute',
    width: PILL_WIDTH,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(55,155,229,0.18)',
  },
  tabBtn: {
    width: SLOT_WIDTH,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  icon: {
    fontSize: 18,
    opacity: 0.6,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#8a8f98',
  },
  labelActive: {
    color: '#379BE5',
  },
});
