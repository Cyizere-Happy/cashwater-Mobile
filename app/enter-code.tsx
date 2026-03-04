
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { SafeAnimatedView } from '@/components/SafeAnimated';
import { FadeInUp, SlideInDown } from 'react-native-reanimated';
import { endpoints } from '@/constants/api';

export default function EnterCodeScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Initialize code with prefilledCode if provided
    const [code, setCode] = useState(
        typeof params.prefilledCode === 'string' ? params.prefilledCode : ''
    );
    const [deviceName, setDeviceName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleVerify = async () => {
        if (!code) {
            Alert.alert('Error', 'Please enter a device code.');
            return;
        }

        let deviceId = code;
        let deviceType = "RESIDENTIAL";

        // Parse TOKEN|TYPE format if present
        if (code.includes('|')) {
            const [token, type] = code.split('|');
            deviceId = token;
            deviceType = type;
        }

        setIsLoading(true);
        try {
            console.log('Requesting location permissions...');
            const { status } = await Location.requestForegroundPermissionsAsync();

            let latitude, longitude, resolvedLocation = 'Unknown Location';
            if (status === 'granted') {
                console.log('--- DIAGNOSTIC: Capturing location... ---');
                // Use a shorter timeout to avoid hanging indefinitely
                const loc = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });
                latitude = loc.coords.latitude;
                longitude = loc.coords.longitude;
                console.log('--- DIAGNOSTIC: Location captured:', latitude, longitude, '---');

                // Location resolution is now handled by the backend
                resolvedLocation = 'Default';
            } else {
                console.warn('--- DIAGNOSTIC: Location permission denied ---');
                Alert.alert(
                    'Location Permission Denied',
                    'We need your location to register the device to your current area.'
                );
                setIsLoading(false);
                return;
            }

            console.log('--- DIAGNOSTIC: Building request payload... ---');
            // In a real app, you'd get the JWT token from storage
            const token = 'dummy_user_token';

            console.log('--- DIAGNOSTIC: Sending registration request to:', endpoints.registerDevice, '---');
            const response = await fetch(endpoints.registerDevice, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    deviceId: deviceId,
                    name: deviceName || (deviceType === 'RESIDENTIAL' ? 'Home Meter' : deviceType === 'COMMERCIAL' ? 'Shop Meter' : 'Industrial Meter'),
                    location: resolvedLocation,
                    latitude,
                    longitude,
                    type: deviceType
                }),
            });
            console.log('--- DIAGNOSTIC: Response received status:', response.status, '---');

            const data = await response.json();

            if (response.ok) {
                console.log('--- DIAGNOSTIC: Registration successful, navigating to dashboard ---');
                // Use a small delay for Web to ensure state is settled before navigation
                if (Platform.OS === 'web') {
                    router.replace('/(tabs)');
                } else {
                    Alert.alert(
                        'Registration Successful',
                        `Device ${deviceId} has been successfully registered as a ${deviceType} property.`,
                        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
                    );
                }
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
                <SafeAnimatedView
                    entering={Platform.OS !== 'web' ? FadeInUp.delay(200).duration(800) : undefined}
                    style={styles.header}
                >
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.white} />
                    </TouchableOpacity>

                    <View style={styles.headerContent}>
                        <Text style={styles.title}>Enter Code</Text>
                        <Text style={styles.subtitle}>
                            Enter the code from your embedded system.
                        </Text>
                    </View>
                </SafeAnimatedView>

                {/* Content Card */}
                <SafeAnimatedView
                    entering={Platform.OS !== 'web' ? SlideInDown.delay(400).duration(800).springify() : undefined}
                    style={styles.contentCard}
                >
                    <View style={styles.form}>
                        <View style={styles.infoBox}>
                            <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
                            <Text style={styles.infoText}>
                                The code can be found on the sticker or the digital display of your device.
                            </Text>
                        </View>

                        <Input
                            placeholder="Device Nickname (e.g. Home, Kitchen)"
                            value={deviceName}
                            onChangeText={setDeviceName}
                        />

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
                </SafeAnimatedView>
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
