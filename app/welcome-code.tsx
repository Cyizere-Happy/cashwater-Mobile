import { Button } from '@/components/Button';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAnimatedView } from '@/components/SafeAnimated';
import { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function WelcomeCodeScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Use the scanned code if available, otherwise generate a mock code
    const deviceCode = typeof params.code === 'string' && params.code.length > 0
        ? params.code
        : 'CW-7X9P2M';

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    <SafeAnimatedView
                        entering={Platform.OS !== 'web' ? FadeInUp.delay(200).duration(800) : undefined}
                        style={styles.iconContainer}
                    >
                        <View style={styles.iconCircle}>
                            <Ionicons name="checkmark-circle" size={60} color={Colors.white} />
                        </View>
                    </SafeAnimatedView>

                    <SafeAnimatedView
                        entering={Platform.OS !== 'web' ? FadeInDown.delay(400).duration(800) : undefined}
                        style={styles.textContainer}
                    >
                        <Text style={styles.title}>Welcome to CashWater</Text>
                        <Text style={styles.subtitle}>
                            Your device was scanned successfully! Use the connection code below to log in and monitor your daily consumption.
                        </Text>
                    </SafeAnimatedView>

                    <SafeAnimatedView
                        entering={Platform.OS !== 'web' ? FadeInDown.delay(600).duration(800) : undefined}
                        style={styles.codeContainer}
                    >
                        <Text style={styles.codeLabel}>CONNECTION CODE</Text>
                        <View style={styles.codeBox}>
                            <Text style={styles.codeText}>{deviceCode}</Text>
                        </View>
                        <Text style={styles.codeHint}>Save this code in a secure location.</Text>
                    </SafeAnimatedView>
                </View>

                <SafeAnimatedView
                    entering={Platform.OS !== 'web' ? FadeInDown.delay(800).duration(800) : undefined}
                    style={styles.footer}
                >
                    <Button
                        title="Proceed to Login"
                        onPress={() => router.push({
                            pathname: '/enter-code',
                            params: { prefilledCode: deviceCode }
                        })}
                        style={styles.button}
                    />
                    <Button
                        title="Scan Different QR"
                        variant="secondary"
                        onPress={() => router.back()}
                        style={styles.secondaryButton}
                    />
                </SafeAnimatedView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    safeArea: {
        flex: 1,
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    iconContainer: {
        marginBottom: 20,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 25,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: Colors.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 10,
    },
    codeContainer: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    codeLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#999',
        letterSpacing: 1.5,
        marginBottom: 10,
    },
    codeBox: {
        backgroundColor: '#F0F7FF',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(57, 108, 184, 0.2)',
    },
    codeText: {
        fontSize: 26,
        fontWeight: '900',
        color: Colors.primary,
        letterSpacing: 2,
    },
    codeHint: {
        fontSize: 12,
        color: '#888',
        fontStyle: 'italic',
    },
    footer: {
        paddingHorizontal: 30,
        paddingBottom: 20,
        gap: 10,
    },
    button: {
        height: 50,
        borderRadius: 25,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
    }
});
