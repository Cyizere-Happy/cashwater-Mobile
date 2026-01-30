
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp, SlideInDown } from 'react-native-reanimated';

export default function EnterCodeScreen() {
    const router = useRouter();
    const [code, setCode] = useState('');

    const handleVerify = () => {
        console.log('Verifying code:', code);
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Compact Header */}
                <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.white} />
                    </TouchableOpacity>

                    <View style={styles.headerContent}>
                        <Text style={styles.title}>Enter Code</Text>
                        <Text style={styles.subtitle}>
                            Enter the code from your embedded system.
                        </Text>
                    </View>
                </Animated.View>

                {/* Content Card */}
                <Animated.View entering={SlideInDown.delay(400).duration(800).springify()} style={styles.contentCard}>
                    <View style={styles.form}>
                        <View style={styles.infoBox}>
                            <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
                            <Text style={styles.infoText}>
                                The code can be found on the sticker or the digital display of your device.
                            </Text>
                        </View>

                        <Input
                            placeholder="Device Code (e.g. CW-12345)"
                            value={code}
                            onChangeText={setCode}
                            autoCapitalize="characters"
                        />

                        <Button
                            title="Verify & Connect"
                            onPress={handleVerify}
                            style={styles.verifyButton}
                        />
                    </View>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 25,
        paddingBottom: 35,
        paddingTop: Platform.OS === 'android' ? 60 : 40,
        minHeight: 250,
        justifyContent: 'center',
    },
    iconButton: {
        marginBottom: 15,
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    headerContent: {
        marginBottom: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 34,
        fontWeight: '900',
        color: Colors.white,
        marginBottom: 5,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: Colors.white,
        opacity: 0.8,
        textAlign: 'center',
    },
    contentCard: {
        flex: 1,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingHorizontal: 30,
        paddingTop: 50, // Increased padding to push content down
        justifyContent: 'center', // Center vertically
    },
    form: {
        marginTop: 0,
        paddingBottom: 100, // Add space at bottom to push content up towards center
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#F0F7FF',
        padding: 15,
        borderRadius: 15,
        marginBottom: 25,
        alignItems: 'center',
        gap: 10,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#444',
        lineHeight: 18,
    },
    verifyButton: {
        marginTop: 20,
        height: 55,
        borderRadius: 28,
    },
});
