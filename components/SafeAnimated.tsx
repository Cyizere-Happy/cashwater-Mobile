import React from 'react';
import { Platform, View, Text, ScrollView, ViewProps, TextProps, ScrollViewProps } from 'react-native';
import Animated, { AnimateProps } from 'react-native-reanimated';

/**
 * A web-safe wrapper for Animated.View.
 * On Web, it returns a regular View to avoid Reanimated 4's CSS injection issues.
 * On Native, it returns the standard Animated.View.
 */
export const SafeAnimatedView = (props: AnimateProps<ViewProps>) => {
    if (Platform.OS === 'web') {
        // Exclude Reanimated-specific props that shouldn't go to regular View
        const { entering, exiting, layout, ...rest } = props as any;
        return <View {...rest} />;
    }
    return <Animated.View {...props} />;
};

/**
 * A web-safe wrapper for Animated.Text.
 */
export const SafeAnimatedText = (props: AnimateProps<TextProps>) => {
    if (Platform.OS === 'web') {
        const { entering, exiting, layout, ...rest } = props as any;
        return <Text {...rest} />;
    }
    return <Animated.Text {...props} />;
};

/**
 * A web-safe wrapper for Animated.ScrollView.
 */
export const SafeAnimatedScrollView = React.forwardRef((props: AnimateProps<ScrollViewProps>, ref: any) => {
    if (Platform.OS === 'web') {
        const { entering, exiting, layout, ...rest } = props as any;
        return <ScrollView {...rest} ref={ref} />;
    }
    return <Animated.ScrollView {...props} ref={ref} />;
});
