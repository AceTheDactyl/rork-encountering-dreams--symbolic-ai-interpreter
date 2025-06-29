import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dreamSymbols } from '@/constants/symbols';
import Colors from '@/constants/colors';

export default function SymbolsScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + 20 }
      ]}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Dream Symbols</Text>
        <Text style={styles.subtitle}>
          Common symbols and their potential meanings
        </Text>
      </View>
      
      <View style={styles.symbolsContainer}>
        {dreamSymbols.map((symbol) => (
          <View key={symbol.symbol} style={styles.symbolCard}>
            <View style={styles.symbolHeader}>
              <Text style={styles.symbolChar}>{symbol.symbol}</Text>
              <Text style={styles.symbolName}>{symbol.name}</Text>
            </View>
            <Text style={styles.symbolMeaning}>{symbol.meaning}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>About Dream Symbols</Text>
        <Text style={styles.infoText}>
          Dream symbols can have both universal and personal meanings. While this guide provides common interpretations, your own associations and experiences may give symbols unique significance in your dreams.
        </Text>
        <Text style={styles.infoText}>
          Pay attention to how you feel about symbols in your dreams, as emotions often provide important context for interpretation.
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
  symbolsContainer: {
    marginBottom: 24,
  },
  symbolCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  symbolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  symbolChar: {
    fontSize: 28,
    color: Colors.dark.primary,
    marginRight: 12,
  },
  symbolName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  symbolMeaning: {
    fontSize: 16,
    color: Colors.dark.text,
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
    marginBottom: 12,
  },
});