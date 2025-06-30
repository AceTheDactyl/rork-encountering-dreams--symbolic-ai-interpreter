import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Dream } from '@/types/dream';
import { getPersona } from '@/constants/personas';
import { getDreamTypeInfo } from '@/constants/dreamTypes';
import Colors from '@/constants/colors';

interface DreamLogItemProps {
  dream: Dream;
}

export default function DreamLogItem({ dream }: DreamLogItemProps) {
  const router = useRouter();
  const persona = getPersona(dream.persona);
  const dreamTypeInfo = dream.dreamType ? getDreamTypeInfo(dream.dreamType) : null;
  
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
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <View style={styles.badgeContainer}>
          <View style={[styles.personaBadge, { backgroundColor: persona.color + '33' }]}>
            <Text style={[styles.personaText, { color: persona.color }]}>
              {persona.name}
            </Text>
          </View>
          {dreamTypeInfo && (
            <View style={[styles.dreamTypeBadge, { backgroundColor: dreamTypeInfo.color + '33' }]}>
              <Text style={styles.dreamTypeSymbol}>{dreamTypeInfo.symbol}</Text>
              <Text style={[styles.dreamTypeText, { color: dreamTypeInfo.color }]}>
                {dream.dreamType?.replace(' Dreams', '')}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.date}>{formatDate(dream.date)}</Text>
      </View>
      
      <Text style={styles.dreamText}>
        {truncateText(dream.text)}
      </Text>
      
      {dream.rationale && dreamTypeInfo && (
        <View style={styles.rationaleContainer}>
          <Text style={styles.rationaleLabel}>
            {dreamTypeInfo.timeIndex} Classification:
          </Text>
          <Text style={styles.rationaleText}>
            {truncateText(dream.rationale, 120)}
          </Text>
        </View>
      )}
      
      <View style={styles.interpretationContainer}>
        <Text style={styles.interpretationLabel}>Interpretation:</Text>
        <Text style={styles.interpretationText}>
          {truncateText(dream.interpretation, 150)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
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
    gap: 4,
  },
  dreamTypeSymbol: {
    fontSize: 12,
    fontWeight: '600',
  },
  dreamTypeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  date: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginLeft: 8,
  },
  dreamText: {
    fontSize: 16,
    color: Colors.dark.text,
    lineHeight: 22,
    marginBottom: 12,
    fontWeight: '500',
  },
  rationaleContainer: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  rationaleLabel: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginBottom: 4,
  },
  rationaleText: {
    fontSize: 14,
    color: Colors.dark.text,
    lineHeight: 18,
    opacity: 0.9,
    fontStyle: 'italic',
  },
  interpretationContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    paddingTop: 12,
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
});