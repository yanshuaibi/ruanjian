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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QUOTES = [
  { text: '专注于旅程，而非目的地。快乐不是在终点找到的，而是在沿途找到的。', author: '格雷格·安德森' },
  { text: '你today做的事，决定了你未来会成为什么样的人。', author: '未知' },
  { text: '不要等待机会，而要创造机会。', author: '乔治·萧伯纳' },
  { text: '每一个不曾起舞的日子，都是对生命的辜负。', author: '尼采' },
  { text: '慢慢来，比较快。', author: '未知' },
];

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

function getGreeting(hour) {
  if (hour < 6) return { icon: '🌙', text: '夜深了，注意休息' };
  if (hour < 12) return { icon: '☀️', text: '上午好，加油' };
  if (hour < 14) return { icon: '🍚', text: '中午好，记得吃饭' };
  if (hour < 18) return { icon: '🏙️', text: '下午好，继续加油' };
  if (hour < 22) return { icon: '🌆', text: '晚上好，辛苦了' };
  return { icon: '🌙', text: '夜深了，早点休息' };
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
        const stored = await AsyncStorage.getItem('@nexus_today_note');
        if (stored !== null) setNote(stored);
      } catch (e) {
        // 忽略读取失败，不影响页面使用
      }
    })();
  }, []);

  const handleNoteChange = (text) => {
    setNote(text);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await AsyncStorage.setItem('@nexus_today_note', text);
        setSavedIndicator(true);
        setTimeout(() => setSavedIndicator(false), 1200);
      } catch (e) {
        // 忽略保存失败
      }
    }, 500);
  };

  const greeting = getGreeting(now.getHours());
  const quote = getDayQuote();
  const dateStr = `${now.getFullYear()} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日  ${WEEKDAYS[now.getDay()]}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* 问候卡片 */}
          <View style={styles.greetingCard}>
            <Text style={styles.dateText}>{dateStr}</Text>
            <Text style={styles.greetingText}>
              {greeting.icon} {greeting.text}
            </Text>

            <View style={styles.clockWrapper}>
              <LinearGradient
                colors={['#8B5CF6', '#4C1D95', '#1E1B4B']}
                start={{ x: 0.2, y: 0.1 }}
                end={{ x: 0.9, y: 0.9 }}
                style={styles.clockCircle}
              >
                <Text style={styles.clockText}>{formatTime(now)}</Text>
              </LinearGradient>
            </View>

            <View style={styles.quoteBox}>
              <Text style={styles.quoteText}>"{quote.text}"</Text>
              <Text style={styles.quoteAuthor}>— {quote.author}</Text>
            </View>
          </View>

          {/* 便签卡片 */}
          <View style={styles.noteCard}>
            <View style={styles.noteHeader}>
              <Text style={styles.noteTitle}>📝 便签</Text>
              {savedIndicator && <Text style={styles.savedText}>已保存</Text>}
            </View>
            <TextInput
              style={styles.noteInput}
              placeholder="随手记点什么..."
              placeholderTextColor="#9CA3AF"
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
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  greetingCard: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  dateText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
  },
  greetingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  clockWrapper: {
    marginVertical: 8,
  },
  clockCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 1,
  },
  quoteBox: {
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 16,
    width: '100%',
  },
  quoteText: {
    color: '#E5E7EB',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  quoteAuthor: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginTop: 16,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  noteTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  savedText: {
    fontSize: 12,
    color: '#10B981',
  },
  noteInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    fontSize: 14,
    color: '#111827',
  },
});
