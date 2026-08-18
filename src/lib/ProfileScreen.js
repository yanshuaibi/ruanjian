import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function ProfileScreen() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [busy, setBusy] = useState(false);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoading(false);
        });
        const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
            setSession(s);
        });
        return () => sub.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!session) { setProfile(null); return; }
        (async () => {
            const { data } = await supabase
                .from('profiles')
                .select('nickname, avatar, is_admin')
                .eq('id', session.user.id)
                .single();
            setProfile(data);
        })();
    }, [session]);

    async function handleLogin() {
        if (!email || !password) return Alert.alert('提示', '请输入邮箱和密码');
        setBusy(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setBusy(false);
        if (error) Alert.alert('登录失败', error.message);
    }

    async function handleLogout() {
        await supabase.auth.signOut();
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        );
    }

    if (!session) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>登录</Text>
                <TextInput
                    style={styles.input}
                    placeholder="邮箱"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="密码"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={busy}>
                    {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>登录</Text>}
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.avatarWrap}>
                <Text style={styles.avatarEmoji}>{profile?.avatar || '😊'}</Text>
            </View>
            <Text style={styles.nickname}>{profile?.nickname || '未命名用户'}</Text>
            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
                <Text style={styles.buttonText}>退出登录</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f2f3f5' },
    container: { flex: 1, backgroundColor: '#f2f3f5', padding: 24, paddingTop: 60, alignItems: 'center' },
    title: { fontSize: 20, fontWeight: '700', marginBottom: 24, alignSelf: 'flex-start' },
    input: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        fontSize: 15,
    },
    button: {
        width: '100%',
        backgroundColor: '#379BE5',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        marginTop: 8,
    },
    logoutButton: { backgroundColor: '#ff5c5c', marginTop: 24 },
    buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    avatarWrap: {
        width: 88, height: 88, borderRadius: 44,
        backgroundColor: '#379BE5',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 14,
    },
    avatarEmoji: { fontSize: 40 },
    nickname: { fontSize: 18, fontWeight: '700', color: '#1c1c1e' },
});
