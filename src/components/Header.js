import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const LOGO_COLORS = ['#973BED', '#007CFF', '#FFC800', '#FF00FF', '#00DA72'];
const LETTERS = ['N', 'E', 'X', 'U', 'S'];

function LogoLetter({ char, color, delay }) {
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(bounce, {
          toValue: -4,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(600 - delay),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.Text
      style={[
        styles.logoChar,
        { color, transform: [{ translateY: bounce }] },
      ]}
    >
      {char}
    </Animated.Text>
  );
}

export default function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.nav}>
        <View style={styles.logo}>
          {LETTERS.map((l, i) => (
            <LogoLetter
              key={i}
              char={l}
              color={LOGO_COLORS[i % LOGO_COLORS.length]}
              delay={i * 100}
            />
          ))}
        </View>
        <View style={styles.navRight}>
          <Text style={styles.navIcon}>🔍</Text>
          <View style={styles.themeToggle}>
            <Text style={styles.themeIcon}>🌙</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e8ec',
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 46,
  },
  logo: { flexDirection: 'row', gap: 1 },
  logoChar: { fontSize: 18, fontWeight: '700' },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  navIcon: { fontSize: 16, opacity: 0.6 },
  themeToggle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeIcon: { fontSize: 15 },
});

