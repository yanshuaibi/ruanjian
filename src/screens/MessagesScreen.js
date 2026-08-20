
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessagesScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.placeholder}>私信——下一步接入</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f2f3f5', alignItems: 'center', justifyContent: 'center' },
    placeholder: { color: '#8a8f98', fontSize: 14 },
});
