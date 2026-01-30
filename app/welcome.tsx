
import { Button } from '@/components/Button';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, SlideInDown } from 'react-native-reanimated';

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
                <Animated.View entering={FadeInDown.duration(1000)} style={styles.logoWrapper}>
                    <View style={styles.iconCircleSmall}>
                        <Ionicons name="water" size={40} color={Colors.white} />
                    </View>
                    <Text style={styles.logoText}>
                        Cash<Text style={styles.logoTextBold}>Water</Text>
                    </Text>
                </Animated.View>
            </View>

            {/* Bottom Section - Card */}
            <Animated.View entering={SlideInDown.delay(300).duration(800).springify()} style={styles.bottomSection}>
                <Text style={styles.welcomeText}>Welcome</Text>
                <Text style={styles.descriptionText}>
                    Monitor your water usage in real time and remotely control the system.
                </Text>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Sign In"
                        onPress={handleSignIn}
                        variant="primary"
                        style={styles.button}
                    />
                    <Button
                        title="Enter Code"
                        onPress={handleEnterCode}
                        variant="secondary"
                        style={styles.button}
                    />
                </View>
            </Animated.View>
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
    },
    logoWrapper: {
        alignItems: 'center',
    },
    iconCircleSmall: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        elevation: 5,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    logoText: {
        fontSize: 32,
        color: Colors.primary,
        letterSpacing: -0.5,
    },
    logoTextBold: {
        fontWeight: '900',
    },
    bottomSection: {
        flex: 2,
        backgroundColor: Colors.primary,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        padding: 30,
        paddingTop: 40,
        justifyContent: 'center',
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 16,
        color: Colors.white,
        opacity: 0.9,
        marginBottom: 35,
        lineHeight: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
    button: {
        flex: 1,
        height: 55,
        borderRadius: 28,
    },
});
