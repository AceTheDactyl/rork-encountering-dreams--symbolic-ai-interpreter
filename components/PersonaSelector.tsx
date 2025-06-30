import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { personas, getPersona } from '@/constants/personas';
import Colors from '@/constants/colors';

interface PersonaSelectorProps {
  selectedPersona: 'orion' | 'limnus';
  onPersonaChange: (persona: 'orion' | 'limnus') => void;
}

export default function PersonaSelector({ selectedPersona, onPersonaChange }: PersonaSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Choose Your Interpreter</Text>
      <View style={styles.selectorContainer}>
        {personas.map((persona) => (
          <Pressable
            key={persona.id}
            style={[
              styles.personaOption,
              selectedPersona === persona.id && styles.selectedOption,
              selectedPersona === persona.id && { borderColor: persona.color }
            ]}
            onPress={() => onPersonaChange(persona.id)}
          >
            <Text style={[
              styles.personaName,
              selectedPersona === persona.id && styles.selectedText
            ]}>
              {persona.name}
            </Text>
            <Text style={[
              styles.personaDescription,
              selectedPersona === persona.id && styles.selectedDescription
            ]}>
              {persona.description}
            </Text>
          </Pressable>
        ))}
      </View>
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
  selectorContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  personaOption: {
    flex: 1,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.dark.border,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: Colors.dark.background,
    borderWidth: 2,
  },
  personaName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  personaDescription: {
    fontSize: 14,
    color: Colors.dark.subtext,
    textAlign: 'center',
  },
  selectedText: {
    color: Colors.dark.text,
  },
  selectedDescription: {
    color: Colors.dark.text,
    opacity: 0.8,
  },
});