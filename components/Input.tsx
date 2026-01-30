
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
        backgroundColor: Colors.gray,
        height: 50,
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        color: Colors.secondary,
    },
});
