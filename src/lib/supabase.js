import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// 跟网页版用的是同一个 Supabase 项目，数据库、RLS 策略、用户账号都是共用的，
// 不用重新搭后端 —— 这也是为什么"重写前端"比"重写整个项目"要现实得多。
const SUPABASE_URL = 'https://njdrapueydsvoetolmzg.supabase.co';
const SUPABASE_ANON_KEY = '你的anon_key'; // 从网页版 index.html 里找 SUPABASE_KEY 那一行，复制过来填这里

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,       // 手机上用 AsyncStorage 存登录状态，对应网页版的 localStorage
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,   // 手机 App 里没有 URL，这个要关掉
    },
});

