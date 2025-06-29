import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, ActivityIndicator, View } from 'react-native';
import Colors from '@/constants/colors';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'secondary';
  style?: ViewStyle;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export default function Button({ 
  label, 
  onPress, 
  variant = 'primary', 
  style, 
  isLoading = false,
  disabled = false,
  icon
}: ButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'outline':
        return [styles.button, styles.outlineButton];
      case 'secondary':
        return [styles.button, styles.secondaryButton];
      default:
        return [styles.button, styles.primaryButton];
    }
  };
  
  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return [styles.text, styles.outlineText];
      case 'secondary':
        return [styles.text, styles.secondaryText];
      default:
        return [styles.text, styles.primaryText];
    }
  };
  
  const isDisabled = disabled || isLoading;
  
  return (
    <Pressable
      style={({ pressed }) => [
        ...getButtonStyle(),
        style,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator 
            size="small" 
            color={variant === 'outline' ? Colors.dark.text : Colors.dark.background} 
          />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={getTextStyle()}>{label}</Text>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  primaryButton: {
    backgroundColor: Colors.dark.primary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  secondaryButton: {
    backgroundColor: Colors.dark.secondary,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: Colors.dark.background,
  },
  outlineText: {
    color: Colors.dark.text,
  },
  secondaryText: {
    color: Colors.dark.background,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
});