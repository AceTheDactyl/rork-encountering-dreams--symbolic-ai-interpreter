import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Dream } from '@/types/dream';
import Colors from '@/constants/colors';
import { dreamThemes } from '@/constants/symbols';

interface DreamCardProps {
  dream: Dream;
}

export default function DreamCard({ dream }: DreamCardProps) {
  const router = useRouter();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const getThemeSymbols = () => {
    return dream.themes
      .map(themeId => {
        const theme = dreamThemes.find(t => t.id === themeId);
        return theme?.symbol || '';
      })
      .filter(Boolean)
      .slice(0, 3)
      .join(' ');
  };
  
  const truncateContent = (content: string, maxLength = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };
  
  const handlePress = () => {
    router.push(`/dream/${dream.id}`);
  };
  
  return (
    <Pressable 
      style={styles.card}
      onPress={handlePress}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{dream.title}</Text>
        <Text style={styles.date}>{formatDate(dream.date)}</Text>
      </View>
      
      <Text style={styles.content}>
        {truncateContent(dream.content)}
      </Text>
      
      <View style={styles.footer}>
        <View style={styles.symbolsContainer}>
          <Text style={styles.symbols}>
            {dream.symbols.join(' ')}
          </Text>
        </View>
        
        <View style={styles.themesContainer}>
          <Text style={styles.themes}>
            {getThemeSymbols()}
          </Text>
        </View>
        
        {dream.isLucid && (
          <View style={[styles.badge, styles.lucidBadge]}>
            <Text style={styles.badgeText}>Lucid</Text>
          </View>
        )}
        
        {dream.isRecurring && (
          <View style={[styles.badge, styles.recurringBadge]}>
            <Text style={styles.badgeText}>Recurring</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    flex: 1,
  },
  date: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
  content: {
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 12,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  symbolsContainer: {
    marginRight: 8,
  },
  symbols: {
    fontSize: 16,
    color: Colors.dark.primary,
  },
  themesContainer: {
    marginRight: 8,
  },
  themes: {
    fontSize: 16,
    color: Colors.dark.secondary,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 4,
  },
  lucidBadge: {
    backgroundColor: Colors.dark.primary + '33', // Adding transparency
  },
  recurringBadge: {
    backgroundColor: Colors.dark.secondary + '33', // Adding transparency
  },
  badgeText: {
    fontSize: 12,
    color: Colors.dark.text,
  },
});