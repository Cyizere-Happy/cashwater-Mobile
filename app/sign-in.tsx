
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp, SlideInDown } from 'react-native-reanimated';

export default function SignInScreen() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = () => {
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.header}>
                    <View style={styles.headerTop}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color={Colors.white} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/enter-code')}>
                            <Text style={styles.headerActionText}>Enter Code</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.headerContent}>
                        <Text style={styles.title}>Sign In</Text>
                        <Text style={styles.subtitle}>
                            Manage your water system securely.
                        </Text>
                    </View>
                </Animated.View>

                {/* Content Card */}
                <Animated.View entering={SlideInDown.delay(400).duration(800).springify()} style={styles.contentCard}>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.form}>
                            <Input
                                placeholder="Username"
                                value={username}
                                onChangeText={setUsername}
                            />
                            <Input
                                placeholder="Password"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />

                            <TouchableOpacity style={styles.forgotPasswordContainer}>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>

                            <Button
                                title="Sign In"
                                onPress={handleSignIn}
                                style={styles.signInButton}
                            />
                        </View>

                        <View style={styles.socialContainer}>
                            <Text style={styles.orText}>Or continue with</Text>
                            <View style={styles.socialButtonsRow}>
                                <TouchableOpacity style={styles.socialIconBtn}>
                                    <Ionicons name="logo-google" size={24} color="#DB4437" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialIconBtn}>
                                    <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialIconBtn}>
                                    <Ionicons name="logo-apple" size={24} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
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
        paddingBottom: 35, // Increased space below subtitle
        paddingTop: Platform.OS === 'android' ? 60 : 40, // Significant top padding
        minHeight: 250, // Much taller header for better vertical balance
        justifyContent: 'center',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    headerActionText: {
        fontWeight: '700',
        fontSize: 15,
        color: Colors.white,
    },
    headerContent: {
        marginBottom: 10,
        alignItems: 'center', // Center titles horizontally
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
        paddingTop: 50, // Increased to push content down slightly
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
        justifyContent: 'center', // Center content vertically in the scroll view
    },
    form: {
        marginBottom: 35,
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: 25,
        marginTop: -5,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
    },
    signInButton: {
        marginTop: 5,
        height: 55,
        borderRadius: 28,
    },
    socialContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    orText: {
        fontSize: 14,
        color: '#888',
        marginBottom: 20,
    },
    socialButtonsRow: {
        flexDirection: 'row',
        gap: 20,
    },
    socialIconBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
    },
});
