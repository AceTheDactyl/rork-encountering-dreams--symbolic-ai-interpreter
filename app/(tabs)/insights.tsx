import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDreamStore } from '@/store/dreamStore';
import { getPersona } from '@/constants/personas';
import { getDreamType, dreamTypes } from '@/constants/dreamTypes';
import Colors from '@/constants/colors';
import EmptyState from '@/components/EmptyState';

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const { dreams } = useDreamStore();
  
  if (dreams.length === 0) {
    return (
      <EmptyState
        title="No insights available"
        message="Record and interpret some dreams to see patterns and insights about your dream journey."
      />
    );
  }
  
  // Calculate statistics
  const orionCount = dreams.filter(d => d.persona === 'orion').length;
  const limnusCount = dreams.filter(d => d.persona === 'limnus').length;
  const totalDreams = dreams.length;
  
  // Calculate dream type statistics
  const dreamTypeStats = dreamTypes.map(type => ({
    ...type,
    count: dreams.filter(d => d.dreamType === type.id).length
  })).filter(stat => stat.count > 0);
  
  const recentDreams = dreams.slice(0, 5);
  const averageLength = Math.round(
    dreams.reduce((sum, dream) => sum + dream.text.length, 0) / totalDreams
  );
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + 20 }
      ]}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Dream Insights</Text>
        <Text style={styles.subtitle}>
          Patterns from your interpretation journey
        </Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalDreams}</Text>
          <Text style={styles.statLabel}>Dreams Interpreted</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{averageLength}</Text>
          <Text style={styles.statLabel}>Avg. Characters</Text>
        </View>
      </View>
      
      <View style={styles.dreamTypeStatsContainer}>
        <Text style={styles.sectionTitle}>Dream Types</Text>
        {dreamTypeStats.map((stat) => (
          <View key={stat.id} style={styles.dreamTypeStatCard}>
            <View style={styles.dreamTypeHeader}>
              <View style={styles.dreamTypeNameContainer}>
                <Text style={[styles.dreamTypeSymbol, { color: stat.color }]}>
                  {stat.symbol}
                </Text>
                <Text style={[styles.dreamTypeName, { color: stat.color }]}>
                  {stat.name}
                </Text>
              </View>
              <Text style={styles.dreamTypeCount}>{stat.count} dreams</Text>
            </View>
            <Text style={styles.dreamTypeDescription}>
              {stat.timeIndex} • {stat.primaryFunction}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(stat.count / totalDreams) * 100}%`,
                    backgroundColor: stat.color 
                  }
                ]} 
              />
            </View>
          </View>
        ))}
      </View>
      
      <View style={styles.personaStatsContainer}>
        <Text style={styles.sectionTitle}>Persona Preferences</Text>
        
        <View style={styles.personaStatCard}>
          <View style={styles.personaHeader}>
            <Text style={[styles.personaName, { color: getPersona('orion').color }]}>
              Orion
            </Text>
            <Text style={styles.personaCount}>{orionCount} interpretations</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${(orionCount / totalDreams) * 100}%`,
                  backgroundColor: getPersona('orion').color 
                }
              ]} 
            />
          </View>
        </View>
        
        <View style={styles.personaStatCard}>
          <View style={styles.personaHeader}>
            <Text style={[styles.personaName, { color: getPersona('limnus').color }]}>
              Limnus
            </Text>
            <Text style={styles.personaCount}>{limnusCount} interpretations</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${(limnusCount / totalDreams) * 100}%`,
                  backgroundColor: getPersona('limnus').color 
                }
              ]} 
            />
          </View>
        </View>
      </View>
      
      <View style={styles.recentContainer}>
        <Text style={styles.sectionTitle}>Recent Dreams</Text>
        {recentDreams.map((dream, index) => {
          const dreamType = getDreamType(dream.dreamType);
          return (
            <View key={dream.id} style={styles.recentItem}>
              <View style={styles.recentHeader}>
                <Text style={styles.recentDreamName}>{dream.name}</Text>
                <Text style={styles.recentDate}>
                  {new Date(dream.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.recentBadgeContainer}>
                <Text style={[
                  styles.recentPersona, 
                  { color: getPersona(dream.persona).color }
                ]}>
                  {getPersona(dream.persona).name}
                </Text>
                {dreamType && (
                  <Text style={[styles.recentDreamType, { color: dreamType.color }]}>
                    {dreamType.symbol} {dreamType.name}
                  </Text>
                )}
              </View>
              <Text style={styles.recentText} numberOfLines={2}>
                {dream.text}
              </Text>
            </View>
          );
        })}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>About Your Journey</Text>
        <Text style={styles.infoText}>
          Each dream interpretation adds to your personal understanding. Orion provides analytical insights while Limnus offers poetic wisdom. The five dream types help classify your experiences across different temporal and symbolic dimensions.
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
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.dark.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
  dreamTypeStatsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 16,
  },
  dreamTypeStatCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  dreamTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dreamTypeNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dreamTypeSymbol: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  dreamTypeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  dreamTypeCount: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
  dreamTypeDescription: {
    fontSize: 13,
    color: Colors.dark.subtext,
    marginBottom: 8,
  },
  personaStatsContainer: {
    marginBottom: 24,
  },
  personaStatCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  personaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  personaName: {
    fontSize: 18,
    fontWeight: '600',
  },
  personaCount: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.dark.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  recentContainer: {
    marginBottom: 24,
  },
  recentItem: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recentDreamName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    flex: 1,
    marginRight: 8,
  },
  recentBadgeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  recentPersona: {
    fontSize: 14,
    fontWeight: '600',
  },
  recentDreamType: {
    fontSize: 12,
    fontWeight: '500',
  },
  recentDate: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
  recentText: {
    fontSize: 15,
    color: Colors.dark.text,
    lineHeight: 20,
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