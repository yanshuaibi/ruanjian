import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';

export default function TodayScreen() {
    const [nickname, setNickname] = useState('');

    useEffect(() => {
        (async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('nickname')
                    .eq('id', user.id)
                    .single();
                if (data) setNickname(data.nickname || '');
            }
        })();
    }, []);

    const now = new Date();
    const dateStr = `${now.getFullYear()} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日`;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.heroCard}>
                <Text style={styles.dateText}>{dateStr}</Text>
                <Text style={styles.greeting}>
                    {nickname ? `你好，${nickname}` : '你好'}
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f2f3f5' },
    content: { padding: 16 },
    heroCard: {
        backgroundColor: '#1c2331',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
    },
    dateText: { color: '#9aa5b1', fontSize: 13, marginBottom: 8 },
    greeting: { color: '#fff', fontSize: 20, fontWeight: '700' },
});
