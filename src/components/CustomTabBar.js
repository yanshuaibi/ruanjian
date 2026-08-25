import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
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
      <BlurView intensity={65} tint="light" style={styles.bar}>
        <Animated.View
          style={[
            styles.pill,
            { transform: [{ translateX: pillX }] },
          ]}
        />
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
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
  bar: {
    width: BAR_WIDTH,
    height: 64,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#2a6ca7',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  pill: {
    position: 'absolute',
    width: PILL_WIDTH,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(55,155,229,0.16)',
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
    opacity: 0.55,
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
