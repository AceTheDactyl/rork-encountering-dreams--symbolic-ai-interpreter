import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RefreshCw, Sparkles, Brain } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useDreamStore } from '@/store/dreamStore';
import { trpc } from '@/lib/trpc';
import { Persona } from '@/types/dream';
import Button from '@/components/Button';

export default function AnalysisScreen() {
  const { dreamId } = useLocalSearchParams<{ dreamId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getDream } = useDreamStore();
  
  const [selectedPersona, setSelectedPersona] = useState<Persona>('orion');
  const [interpretation, setInterpretation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const dream = getDream(dreamId);
  
  const interpretMutation = trpc.dreams.interpret.useMutation({
    onSuccess: (data) => {
      setInterpretation(data.interpretation);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Interpretation error:', error);
      setIsLoading(false);
      // You could show an error message here
    },
  });
  
  useEffect(() => {
    if (dream) {
      generateInterpretation();
    }
  }, [dream, selectedPersona]);
  
  const generateInterpretation = async () => {
    if (!dream) return;
    
    setIsLoading(true);
    interpretMutation.mutate({
      dreamText: dream.content,
      dreamTitle: dream.title,
      persona: selectedPersona,
      symbols: dream.symbols,
      themes: dream.themes,
      isLucid: dream.isLucid,
      isRecurring: dream.isRecurring,
    });
  };
  
  if (!dream) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Dream not found</Text>
        <Button
          label="Go Back"
          onPress={() => router.back()}
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }
  
  const getPersonaInfo = (persona: Persona) => {
    return persona === 'orion' 
      ? { name: 'Orion', description: 'Analytical & Structured', icon: Brain, color: Colors.dark.primary }
      : { name: 'Limnus', description: 'Poetic & Intuitive', icon: Sparkles, color: Colors.dark.secondary };
  };
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + 20 }
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dream Analysis</Text>
        <Text style={styles.dreamTitle}>{dream.title}</Text>
      </View>
      
      <View style={styles.personaSelector}>
        <Text style={styles.sectionTitle}>Choose Your Interpreter</Text>
        <View style={styles.personaButtons}>
          {(['orion', 'limnus'] as Persona[]).map((persona) => {
            const info = getPersonaInfo(persona);
            const IconComponent = info.icon;
            const isSelected = selectedPersona === persona;
            
            return (
              <Pressable
                key={persona}
                style={[
                  styles.personaButton,
                  isSelected && { backgroundColor: info.color + '33', borderColor: info.color }
                ]}
                onPress={() => setSelectedPersona(persona)}
              >
                <IconComponent 
                  size={24} 
                  color={isSelected ? info.color : Colors.dark.subtext} 
                />
                <Text style={[
                  styles.personaName,
                  isSelected && { color: info.color }
                ]}>
                  {info.name}
                </Text>
                <Text style={styles.personaDescription}>{info.description}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      
      {interpretation && (
        <View style={styles.analysisContainer}>
          <View style={styles.analysisHeader}>
            <Text style={styles.analysisTitle}>
              {getPersonaInfo(selectedPersona).name}'s Interpretation
            </Text>
            <Pressable 
              style={styles.refreshButton}
              onPress={generateInterpretation}
              disabled={isLoading}
            >
              <RefreshCw 
                size={20} 
                color={isLoading ? Colors.dark.subtext : Colors.dark.text} 
              />
            </Pressable>
          </View>
          <Text style={styles.analysisText}>{interpretation}</Text>
        </View>
      )}
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {getPersonaInfo(selectedPersona).name} is analyzing your dream...
          </Text>
        </View>
      )}
      
      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerTitle}>Remember</Text>
        <Text style={styles.disclaimerText}>
          Dream interpretation is subjective and personal. These AI-generated analyses are based on common symbolic associations and different interpretive approaches, but your own experiences and emotions provide the most meaningful context.
        </Text>
        <Text style={styles.disclaimerText}>
          Dreams may reflect your subconscious processing of daily experiences, emotions, and memories. They can offer insights, but are not predictive or definitive.
        </Text>
      </View>
      
      <Button
        label="Return to Dream"
        onPress={() => router.back()}
        style={styles.button}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  dreamTitle: {
    fontSize: 18,
    color: Colors.dark.subtext,
    fontStyle: 'italic',
  },
  personaSelector: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 12,
  },
  personaButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  personaButton: {
    flex: 1,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  personaName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginTop: 8,
    marginBottom: 4,
  },
  personaDescription: {
    fontSize: 12,
    color: Colors.dark.subtext,
    textAlign: 'center',
  },
  analysisContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  refreshButton: {
    padding: 4,
  },
  analysisText: {
    fontSize: 16,
    color: Colors.dark.text,
    lineHeight: 24,
  },
  loadingContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.dark.subtext,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  disclaimerContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.dark.secondary,
  },
  disclaimerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 15,
    color: Colors.dark.subtext,
    marginBottom: 12,
    lineHeight: 22,
  },
  button: {
    marginTop: 8,
  },
  errorText: {
    fontSize: 18,
    color: Colors.dark.text,
    textAlign: 'center',
  },
});