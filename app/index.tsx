
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('/welcome');
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            {/* Subtle Gradient-like Shapes */}
            <View style={styles.topCircle} />
            <View style={styles.bottomCircle} />

            {/* Clean Logo Content */}
            <Animated.View entering={ZoomIn.duration(800).springify()} style={styles.logoWrapper}>
                <View style={styles.iconCircle}>
                    <Ionicons name="water" size={60} color={Colors.white} />
                </View>
                <Animated.View entering={FadeInDown.delay(400).duration(800)}>
                    <Text style={styles.logoText}>
                        Cash<Text style={styles.logoTextBold}>Water</Text>
                    </Text>
                </Animated.View>
            </Animated.View>

            {/* Footer Text */}
            <Animated.View entering={FadeIn.delay(800).duration(1000)} style={styles.footer}>
                <Text style={styles.footerText}>SECURE WATER MANAGEMENT</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topCircle: {
        position: 'absolute',
        top: -width * 0.1,
        right: -width * 0.1,
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: width * 0.3,
        backgroundColor: Colors.primary,
        opacity: 0.12,
    },
    bottomCircle: {
        position: 'absolute',
        bottom: -width * 0.1,
        left: -width * 0.1,
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: width * 0.3,
        backgroundColor: Colors.primary,
        opacity: 0.12,
    },
    logoWrapper: {
        alignItems: 'center',
        zIndex: 1,
    },
    iconCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 8,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    logoText: {
        fontSize: 36,
        color: Colors.primary,
        letterSpacing: -0.5,
    },
    logoTextBold: {
        fontWeight: '800', // slightly less heavy for a cleaner look
    },
    footer: {
        position: 'absolute',
        bottom: 50,
    },
    footerText: {
        fontSize: 12,
        color: Colors.primary,
        letterSpacing: 3,
        fontWeight: '500', // more subtle weight
        opacity: 0.5, // softer opacity
    },
});
