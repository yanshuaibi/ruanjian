import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import TodayScreen from '../screens/TodayScreen';
import AppsScreen from '../screens/AppsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// 每个 tab 用 emoji 当图标，先跑起来再说，后面想换成正式图标集也简单
const TAB_ICONS = {
    今日: '🔲',
    应用: '📦',
    私信: '💬',
    我的: '👤',
};

export default function RootNavigation() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarActiveTintColor: '#379BE5',
                    tabBarInactiveTintColor: '#8a8f98',
                    tabBarIcon: () => <Text style={{ fontSize: 18 }}>{TAB_ICONS[route.name]}</Text>,
                })}
            >
                <Tab.Screen name="今日" component={TodayScreen} />
                <Tab.Screen name="应用" component={AppsScreen} />
                <Tab.Screen name="私信" component={MessagesScreen} />
                <Tab.Screen name="我的" component={ProfileScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
