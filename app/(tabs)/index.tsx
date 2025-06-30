import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  RefreshControl
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDreamStore } from '@/store/dreamStore';
import { InterpretationService } from '@/services/interpretationService';
import { getPersona } from '@/constants/personas';
import Colors from '@/constants/colors';
import PersonaSelector from '@/components/PersonaSelector';
import DreamInput from '@/components/DreamInput';
import Button from '@/components/Button';
import DreamLogItem from '@/components/DreamLogItem';
import EmptyState from '@/components/EmptyState';

export default function InterpreterScreen() {
  const insets = useSafeAreaInsets();
  const { dreams, addDream } = useDreamStore();
  
  const [dreamText, setDreamText] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<'orion' | 'limnus'>('orion');
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const handleInterpret = async () => {
    if (!dreamText.trim()) {
      Alert.alert('Empty Dream', 'Please enter your dream before interpreting.');
      return;
    }
    
    setIsInterpreting(true);
    
    try {
      const persona = getPersona(selectedPersona);
      const result = await InterpretationService.interpretDream(dreamText.trim(), persona);
      
      const newDream = {
        id: Date.now().toString(),
        name: result.name,
        text: dreamText.trim(),
        persona: selectedPersona,
        interpretation: result.interpretation,
        dreamType: result.dreamType,
        date: new Date().toISOString(),
      };
      
      addDream(newDream);
      setDreamText('');
      
    } catch (error) {
      Alert.alert(
        'Interpretation Failed', 
        error instanceof Error ? error.message : 'An unexpected error occurred.'
      );
    } finally {
      setIsInterpreting(false);
    }
  };
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  
  const isInterpretDisabled = !dreamText.trim() || isInterpreting;
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + 20 }
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.dark.primary}
            colors={[Colors.dark.primary]}
          />
        }
      >
        <View style={styles.inputSection}>
          <DreamInput
            value={dreamText}
            onChangeText={setDreamText}
          />
          
          <PersonaSelector
            selectedPersona={selectedPersona}
            onPersonaChange={setSelectedPersona}
          />
          
          <Button
            label={isInterpreting ? "Interpreting..." : "Interpret Dream"}
            onPress={handleInterpret}
            disabled={isInterpretDisabled}
            isLoading={isInterpreting}
            style={styles.interpretButton}
          />
        </View>
        
        <View style={styles.logSection}>
          {dreams.length > 0 ? (
            dreams.map((dream) => (
              <DreamLogItem key={dream.id} dream={dream} />
            ))
          ) : (
            <EmptyState
              title="No interpretations yet"
              message="Enter your first dream above and choose a persona to begin your journey of dream interpretation."
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  inputSection: {
    marginBottom: 32,
  },
  interpretButton: {
    marginTop: 8,
  },
  logSection: {
    flex: 1,
  },
});