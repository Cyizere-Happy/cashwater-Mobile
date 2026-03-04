import React from 'react';
import { Platform } from 'react-native';
import { SafeAnimatedText } from '@/components/SafeAnimated';

export function HelloWave() {
  const isWeb = Platform.OS === 'web';

  return (
    <SafeAnimatedText
      style={{
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
        // Only apply these animations on native if they work with Reanimated.Text styles
        ...(isWeb ? {} : {
          animationName: {
            '50%': { transform: [{ rotate: '25deg' }] },
          },
          animationIterationCount: 4,
          animationDuration: '300ms',
        })
      }}>
      👋
    </SafeAnimatedText>
  );
}
