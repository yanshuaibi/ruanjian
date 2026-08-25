import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// 跟网页版用的是同一个 Supabase 项目，数据库、RLS 策略、用户账号都是共用的，
// 不用重新搭后端 —— 这也是为什么"重写前端"比"重写整个项目"要现实得多。
const SUPABASE_URL = 'https://njdrapueydsvoetolmzg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qZHJhcHVleWRzdmVldG9sbXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NjM4MTEsImV4cCI6MjA4OTEzOTgxMX0.VJTGetTjpxvZQl74cwHEmaqRYDelnOfvv6GFM5WDMj0'; // 从网页版 index.html 里找 SUPABASE_KEY 那一行，复制过来填这里

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,       // 手机上用 AsyncStorage 存登录状态，对应网页版的 localStorage
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,   // 手机 App 里没有 URL，这个要关掉
    },
});

