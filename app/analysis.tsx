import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useDreamStore } from '@/store/dreamStore';
import Button from '@/components/Button';

export default function AnalysisScreen() {
  const { dreamId, interpretation } = useLocalSearchParams<{ dreamId: string, interpretation: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getDream } = useDreamStore();
  
  const dream = getDream(dreamId);
  
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
      
      <View style={styles.analysisContainer}>
        <Text style={styles.analysisText}>{interpretation}</Text>
      </View>
      
      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerTitle}>Remember</Text>
        <Text style={styles.disclaimerText}>
          Dream interpretation is subjective and personal. This analysis is based on common symbolic associations, but your own experiences and emotions provide the most meaningful context.
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
  analysisContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  analysisText: {
    fontSize: 16,
    color: Colors.dark.text,
    lineHeight: 24,
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