import { Button } from '@/components/Button';
import { Colors } from '@/constants/theme';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ScanQRScreen() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const router = useRouter();

    if (!permission) {
        // Camera permissions are still loading.
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
        setScanned(true);
        // Instead of directly going to tabs, route to the welcome-code screen with the code
        router.push({
            pathname: '/welcome-code',
            params: { code: data }
        });
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
            >
                <View style={styles.overlay}>
                    <Text style={styles.title}>Scan QR Code</Text>
                    <Text style={styles.subtitle}>Align the QR code within the frame to connect your device.</Text>

                    <View style={styles.scannerFrame}>
                        {/* Corner markers for the scanner frame */}
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>

                    {scanned && (
                        <Button
                            title="Tap to Scan Again"
                            onPress={() => setScanned(false)}
                            style={styles.rescanButton}
                        />
                    )}

                    <View style={styles.footer}>
                        <Button
                            title="Enter Code Manually"
                            variant="secondary"
                            onPress={() => router.push('/enter-code')}
                            style={styles.manualButton}
                        />
                        <Button
                            title="Cancel"
                            variant="outline"
                            onPress={() => router.back()}
                            style={styles.cancelButton}
                            textStyle={{ color: Colors.white }}
                        />
                    </View>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: Colors.white,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 20,
        fontSize: 16,
        color: Colors.secondary,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)', // Dark overlay
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.white,
        marginTop: 40,
        marginBottom: 5,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: Colors.white,
        opacity: 0.8,
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    scannerFrame: {
        width: 220,
        height: 220,
        backgroundColor: 'transparent',
        position: 'relative',
        marginBottom: 30,
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: Colors.primary, // Brand blue for the scanner frame
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderTopLeftRadius: 16,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderTopRightRadius: 16,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderBottomLeftRadius: 16,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderBottomRightRadius: 16,
    },
    rescanButton: {
        width: 180,
        marginBottom: 15,
    },
    footer: {
        marginTop: 'auto',
        width: '100%',
        gap: 12,
        paddingBottom: 20,
    },
    manualButton: {
        backgroundColor: Colors.white,
    },
    cancelButton: {
        borderColor: 'rgba(255,255,255,0.3)',
    }
});
