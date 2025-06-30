import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import Colors from '@/constants/colors';

interface DreamInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function DreamInput({ 
  value, 
  onChangeText, 
  placeholder = "Describe your dream in detail..." 
}: DreamInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Dream</Text>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.dark.subtext}
        multiline
        textAlignVertical="top"
        scrollEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    color: Colors.dark.text,
    fontSize: 16,
    lineHeight: 22,
    minHeight: 120,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
});