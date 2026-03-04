
import { Button } from '@/components/Button';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, View, Platform } from 'react-native';
import { SafeAnimatedView } from '@/components/SafeAnimated';
import { FadeInDown, SlideInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();

    const handleSignIn = () => {
        router.push('/sign-in');
    };

    const handleEnterCode = () => {
        router.push('/enter-code');
    };

    return (
        <View style={styles.container}>
            {/* Top Section - Enhanced Logo */}
            <View style={styles.topSection}>
                <SafeAnimatedView
                    entering={Platform.OS !== 'web' ? FadeInDown.duration(1000) : undefined}
                    style={styles.logoWrapper}
                >
                    <View style={styles.iconCircleSmall}>
                        <Ionicons name="water" size={32} color={Colors.white} />
                    </View>
                    <Text style={styles.logoText}>
                        Cash<Text style={styles.logoTextBold}>Water</Text>
                    </Text>
                </SafeAnimatedView>
            </View>

            {/* Bottom Section - Card */}
            <SafeAnimatedView
                entering={Platform.OS !== 'web' ? SlideInDown.delay(300).duration(800).springify() : undefined}
                style={styles.bottomSection}
            >
                <Text style={styles.welcomeText}>Welcome</Text>
                <Text style={styles.descriptionText}>
                    Monitor your water usage in real time and remotely control the system.
                </Text>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Connect with QR"
                        onPress={() => router.push('/scan-qr')}
                        variant="primary"
                        style={styles.button}
                    />
                    <Button
                        title="Enter Code manually"
                        onPress={handleEnterCode}
                        variant="secondary"
                        style={styles.button}
                    />
                </View>
            </SafeAnimatedView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    topSection: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
    },
    logoWrapper: {
        alignItems: 'center',
    },
    iconCircleSmall: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        elevation: 5,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    logoText: {
        fontSize: 28,
        color: Colors.primary,
        letterSpacing: -0.5,
    },
    logoTextBold: {
        fontWeight: '800',
    },
    bottomSection: {
        flex: 2,
        backgroundColor: Colors.primary,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        paddingTop: 30,
        justifyContent: 'center',
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: 5,
    },
    descriptionText: {
        fontSize: 13,
        color: Colors.white,
        opacity: 0.85,
        marginBottom: 25,
        lineHeight: 20,
    },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 10,
    },
    button: {
        width: '100%',
        height: 50,
        borderRadius: 25,
    },
});
