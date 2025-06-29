import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDreamStore } from '@/store/dreamStore';
import { detectPatterns } from '@/utils/dreamAnalysis';
import Colors from '@/constants/colors';
import EmptyState from '@/components/EmptyState';
import { useRouter } from 'expo-router';

export default function PatternsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { dreams } = useDreamStore();
  
  const patterns = dreams.length >= 2 ? detectPatterns(dreams) : [];
  
  const navigateToNewDream = () => {
    router.push('/new-dream');
  };
  
  if (dreams.length < 2) {
    return (
      <EmptyState
        title="Not enough dreams"
        message="Record at least two dreams to start seeing patterns in your dream landscape."
        action={{
          label: "Record Dream",
          onPress: navigateToNewDream,
        }}
      />
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
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Dream Patterns</Text>
        <Text style={styles.subtitle}>
          Insights from your dream journal
        </Text>
      </View>
      
      {patterns.length > 0 ? (
        <View style={styles.patternsContainer}>
          {patterns.map((pattern, index) => (
            <View key={index} style={styles.patternCard}>
              <Text style={styles.patternText}>{pattern}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.noPatterns}>
          <Text style={styles.noPatternText}>
            No significant patterns detected yet. Continue recording your dreams to reveal deeper connections.
          </Text>
        </View>
      )}
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>About Dream Patterns</Text>
        <Text style={styles.infoText}>
          Dreams often contain recurring symbols, themes, and emotions that can provide insights into your subconscious mind. As you record more dreams, patterns will emerge that may reflect your current life situations, unresolved issues, or personal growth.
        </Text>
      </View>
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
  headerContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.subtext,
  },
  patternsContainer: {
    marginBottom: 24,
  },
  patternCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.dark.primary,
  },
  patternText: {
    fontSize: 16,
    color: Colors.dark.text,
    lineHeight: 22,
  },
  noPatterns: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  noPatternText: {
    fontSize: 16,
    color: Colors.dark.subtext,
    textAlign: 'center',
    lineHeight: 22,
  },
  infoContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: Colors.dark.subtext,
    lineHeight: 22,
  },
});