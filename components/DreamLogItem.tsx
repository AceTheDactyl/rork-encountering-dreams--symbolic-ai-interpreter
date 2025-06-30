import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Dream } from '@/types/dream';
import { getPersona } from '@/constants/personas';
import { getDreamType } from '@/constants/dreamTypes';
import Colors from '@/constants/colors';

interface DreamLogItemProps {
  dream: Dream;
  showGroupHeader?: boolean;
  groupTitle?: string;
}

export default function DreamLogItem({ dream, showGroupHeader, groupTitle }: DreamLogItemProps) {
  const router = useRouter();
  const persona = getPersona(dream.persona);
  const dreamType = getDreamType(dream.dreamType);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const truncateText = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  const handlePress = () => {
    router.push(`/dream/${dream.id}`);
  };
  
  return (
    <View>
      {showGroupHeader && groupTitle && (
        <View style={styles.groupHeader}>
          <Text style={styles.groupTitle}>{groupTitle}</Text>
        </View>
      )}
      
      <Pressable style={styles.container} onPress={handlePress}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.dreamName}>{dream.name}</Text>
            <View style={styles.badgeContainer}>
              <View style={[styles.personaBadge, { backgroundColor: persona.color + '33' }]}>
                <Text style={[styles.personaText, { color: persona.color }]}>
                  {persona.name}
                </Text>
              </View>
              {dreamType && (
                <View style={[styles.dreamTypeBadge, { backgroundColor: dreamType.color + '33' }]}>
                  <Text style={[styles.dreamTypeSymbol, { color: dreamType.color }]}>
                    {dreamType.symbol}
                  </Text>
                  <Text style={[styles.dreamTypeText, { color: dreamType.color }]}>
                    {dreamType.name}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <Text style={styles.date}>{formatDate(dream.date)}</Text>
        </View>
        
        <Text style={styles.dreamText}>
          {truncateText(dream.text)}
        </Text>
        
        <View style={styles.interpretationContainer}>
          <Text style={styles.interpretationLabel}>Interpretation:</Text>
          <Text style={styles.interpretationText}>
            {truncateText(dream.interpretation, 150)}
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.lengthIndicator}>
            {dream.text.length} characters
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  groupHeader: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginTop: 8,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  dreamName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  personaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  personaText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dreamTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dreamTypeSymbol: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 6,
  },
  dreamTypeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  date: {
    fontSize: 14,
    color: Colors.dark.subtext,
    textAlign: 'right',
  },
  dreamText: {
    fontSize: 16,
    color: Colors.dark.text,
    lineHeight: 22,
    marginBottom: 12,
    fontWeight: '500',
  },
  interpretationContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    paddingTop: 12,
    marginBottom: 8,
  },
  interpretationLabel: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginBottom: 4,
  },
  interpretationText: {
    fontSize: 15,
    color: Colors.dark.text,
    lineHeight: 20,
    opacity: 0.9,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  lengthIndicator: {
    fontSize: 12,
    color: Colors.dark.subtext,
    opacity: 0.7,
  },
});