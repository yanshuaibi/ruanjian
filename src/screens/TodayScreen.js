import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';

const QUOTES = [
  { text: '专注于旅程，而非目的地。快乐不是在终点找到的，而是在沿途找到的。', author: '格雷格·安德森' },
  { text: '你今天做的事，决定了你未来会成为什么样的人。', author: '未知' },
  { text: '不要等待机会，而要创造机会。', author: '乔治·萧伯纳' },
  { text: '每一个不曾起舞的日子，都是对生命的辜负。', author: '尼采' },
  { text: '慢慢来，比较快。', author: '未知' },
];

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

function getGreeting(hour) {
  if (hour >= 5 && hour < 9) return '🌅 早上好，元气满满的一天开始啦';
  if (hour >= 9 && hour < 12) return '☀️ 上午好，专注当下';
  if (hour >= 12 && hour < 14) return '🌤️ 中午好，记得吃饭休息';
  if (hour >= 14 && hour < 18) return '🌇 下午好，继续加油';
  if (hour >= 18 && hour < 21) return '🌆 傍晚好，今天辛苦了';
  if (hour >= 21 && hour < 23) return '🌙 晚上好，适当放松一下';
  return '🌌 夜深了，注意休息';
}

function formatTime(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function getDayQuote() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

function ClockOrb({ timeText }) {
  const rotate = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });

  return (
    <View style={styles.clockWrapper}>
      <LinearGradient
        colors={['#471eec', '#1a1a2e']}
        style={styles.clockCircle}
      >
        <Animated.View
          style={[
            styles.clockGlow,
            { transform: [{ rotate: spin }, { scale }] },
          ]}
        >
          <LinearGradient
            colors={['#ffffff', '#ad5fff', 'transparent']}
            start={{ x: 0.3, y: 0.1 }}
            end={{ x: 1, y: 1 }}
            style={styles.clockGlowInner}
          />
        </Animated.View>
        <Text style={styles.clockText}>{timeText}</Text>
      </LinearGradient>
    </View>
  );
}

export default function TodayScreen() {
  const [now, setNow] = useState(new Date());
  const [note, setNote] = useState('');
  const [savedIndicator, setSavedIndicator] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('nexus_note_v1');
        if (stored !== null) setNote(stored);
      } catch (e) {}
    })();
  }, []);

  const handleNoteChange = (text) => {
    setNote(text);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await AsyncStorage.setItem('nexus_note_v1', text);
        setSavedIndicator(true);
        setTimeout(() => setSavedIndicator(false), 2000);
      } catch (e) {}
    }, 500);
  };

  const greeting = getGreeting(now.getHours());
  const quote = getDayQuote();
  const dateStr = `${now.getFullYear()} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日  ${WEEKDAYS[now.getDay()]}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient
            colors={['#1a1a2e', '#16213e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <Text style={styles.heroDate}>{dateStr}</Text>
            <Text style={styles.heroGreeting}>{greeting}</Text>

            <ClockOrb timeText={formatTime(now)} />

            <View style={styles.quoteBox}>
              <Text style={styles.quoteText}>" {quote.text} "</Text>
              <Text style={styles.quoteAuthor}>— {quote.author}</Text>
            </View>
          </LinearGradient>

          <View style={styles.noteCard}>
            <View style={styles.noteHeader}>
              <Text style={styles.noteTitle}>📝 便签</Text>
              {savedIndicator && <Text style={styles.savedText}>已保存 ✓</Text>}
            </View>
            <TextInput
              style={styles.noteInput}
              placeholder="随手记点什么…"
              placeholderTextColor="#8e99a3"
              multiline
              value={note}
              onChangeText={handleNoteChange}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: { padding: 16, paddingBottom: 32 },
  hero: {
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  heroDate: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  heroGreeting: {
    fontSize: 17,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.92)',
    marginBottom: 20,
  },
  clockWrapper: { marginVertical: 8 },
  clockCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  clockGlow: {
    position: 'absolute',
    width: 280,
    height: 280,
    top: -40,
    left: -40,
  },
  clockGlowInner: {
    width: '100%',
    height: '100%',
    borderRadius: 140,
    opacity: 0.55,
  },
  clockText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  quoteBox: {
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    width: '100%',
  },
  quoteText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    lineHeight: 22,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  quoteAuthor: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderColor: '#e3e8ec',
    borderWidth: 1,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8e99a3',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  savedText: { fontSize: 11, color: '#4FAE4E' },
  noteInput: {
    backgroundColor: '#f0f4f7',
    borderColor: '#e3e8ec',
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    fontSize: 14,
    lineHeight: 22,
    color: '#1c1c1e',
  },
});
