import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Moon } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from '@/components/Button';

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export default function EmptyState({ 
  title = "No dreams yet", 
  message = "Start recording your dreams to unlock insights into your subconscious mind.",
  action
}: EmptyStateProps) {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Moon size={64} color={Colors.dark.primary} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      
      {action && (
        <Button 
          label={action.label}
          onPress={action.onPress}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.dark.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: Colors.dark.subtext,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    marginTop: 8,
  },
});