import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import TodayScreen from '../screens/TodayScreen';
import AppsScreen from '../screens/AppsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CustomTabBar from '../components/CustomTabBar';

const Tab = createMaterialTopTabNavigator();

export default function RootNavigation() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                tabBarPosition="bottom"
                swipeEnabled={true}
                animationEnabled={true}
                tabBar={(props) => <CustomTabBar {...props} />}
            >
                <Tab.Screen name="今日" component={TodayScreen} />
                <Tab.Screen name="应用" component={AppsScreen} />
                <Tab.Screen name="私信" component={MessagesScreen} />
                <Tab.Screen name="我的" component={ProfileScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
