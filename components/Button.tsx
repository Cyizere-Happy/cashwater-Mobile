
import { Colors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    style,
    textStyle,
    icon
}) => {
    const getBackgroundColor = () => {
        switch (variant) {
            case 'primary': return Colors.secondary; // Black
            case 'secondary': return Colors.white;
            case 'outline': return 'transparent';
            default: return Colors.secondary;
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'primary': return Colors.white;
            case 'secondary': return Colors.secondary; // Black
            case 'outline': return Colors.secondary;
            default: return Colors.white;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor: getBackgroundColor() },
                variant === 'outline' && styles.outline,
                style
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {icon}
            <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
        width: '100%',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    outline: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
    }
});
