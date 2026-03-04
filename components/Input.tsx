
import { Colors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
    placeholder: string;
}

export const Input: React.FC<InputProps> = ({ placeholder, style, ...props }) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, style]}
                placeholder={placeholder}
                placeholderTextColor="#999"
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 16,
    },
    input: {
        backgroundColor: Colors.white,
        height: 55, // slightly taller for a premium feel
        borderRadius: 28,
        paddingHorizontal: 22,
        fontSize: 16,
        color: Colors.secondary,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
});
