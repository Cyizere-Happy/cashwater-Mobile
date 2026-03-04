
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';
import Animated, { FadeInUp, SlideInDown } from 'react-native-reanimated';
import { endpoints } from '@/constants/api';

export default function EnterCodeScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Initialize code with prefilledCode if provided
    const [code, setCode] = useState(
        typeof params.prefilledCode === 'string' ? params.prefilledCode : ''
    );
    const [isLoading, setIsLoading] = useState(false);

    const handleVerify = async () => {
        if (!code) {
            Alert.alert('Error', 'Please enter a device code.');
            return;
        }

        setIsLoading(true);
        try {
            console.log('Requesting location permissions...');
            const { status } = await Location.requestForegroundPermissionsAsync();

            let latitude, longitude;
            if (status === 'granted') {
                const loc = await Location.getCurrentPositionAsync({});
                latitude = loc.coords.latitude;
                longitude = loc.coords.longitude;
                console.log('Location captured:', latitude, longitude);
            } else {
                Alert.alert(
                    'Location Permission Denied',
                    'We need your location to register the device to your current area. Please enable it in settings.'
                );
                setIsLoading(false);
                return;
            }

            console.log('Registering device with code:', code);

            // In a real app, you'd get the JWT token from storage
            const token = 'dummy_user_token';

            const response = await fetch(endpoints.registerDevice, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    deviceId: code,
                    name: 'My Smart Meter',
                    location: 'Home',
                    latitude,
                    longitude
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Device connected successfully!');
                router.replace('/(tabs)');
            } else {
                Alert.alert('Registration Failed', data.message || 'Could not register device');
            }
        } catch (error) {
            console.error('Registration error calling:', endpoints.registerDevice, error);
            Alert.alert('Error', `Connection failed to ${endpoints.registerDevice}. Check your network.`);
            router.replace('/(tabs)');
        } finally {
            setIsLoading(false);
        }
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
                            title={isLoading ? "Connecting..." : "Verify & Connect"}
                            onPress={handleVerify}
                            disabled={isLoading}
                            style={styles.verifyButton}
                        />
                        {isLoading && <ActivityIndicator style={{ marginTop: 20 }} color={Colors.primary} />}
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
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: Platform.OS === 'android' ? 40 : 20,
        minHeight: 180,
        justifyContent: 'center',
    },
    iconButton: {
        marginBottom: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    headerContent: {
        marginBottom: 5,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: Colors.white,
        marginBottom: 5,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: Colors.white,
        opacity: 0.8,
        textAlign: 'center',
    },
    contentCard: {
        flex: 1,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 25,
        paddingTop: 30,
        justifyContent: 'center',
    },
    form: {
        marginTop: 0,
        paddingBottom: 40,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#F0F7FF',
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
        alignItems: 'center',
        gap: 8,
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        color: '#444',
        lineHeight: 16,
    },
    verifyButton: {
        marginTop: 15,
        height: 50,
        borderRadius: 25,
    },
});
