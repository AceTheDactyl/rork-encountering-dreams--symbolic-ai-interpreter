import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Share2, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useDreamStore } from '@/store/dreamStore';
import { getPersona } from '@/constants/personas';
import Button from '@/components/Button';

const dreamTypeColors = {
  'Mnemonic Dreams': '#8B5CF6',
  'Psychic Dreams': '#06B6D4', 
  'Pre-Echo Dreams': '#10B981',
  'Lucid Dreams': '#F59E0B',
  'Meta-Lucid Dreams': '#EF4444',
};

const dreamTypeDescriptions = {
  'Mnemonic Dreams': 'Past-focused • Memory recursion • Echo fields',
  'Psychic Dreams': 'Present-focused • Emotional integration • Stress grid',
  'Pre-Echo Dreams': 'Future-focused • Probability tuning • Vector threads',
  'Lucid Dreams': 'Now/overlaid • Symbol control • Agency kernel',
  'Meta-Lucid Dreams': 'Recursive/all • Architectural interface • Compression core',
};

export default function DreamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getDream, deleteDream } = useDreamStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const dream = getDream(id);
  
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
  
  const persona = getPersona(dream.persona);
  const dreamTypeColor = dream.dreamType ? dreamTypeColors[dream.dreamType] : Colors.dark.subtext;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleShare = async () => {
    try {
      const dreamTypeInfo = dream.dreamType ? `\n\nDream Type: ${dream.dreamType}\n${dream.rationale || ''}` : '';
      
      await Share.share({
        title: `Dream interpreted by ${persona.name}`,
        message: `My Dream:

${dream.text}${dreamTypeInfo}

${persona.name}'s Interpretation:

${dream.interpretation}

Interpreted on ${formatDate(dream.date)}`,
      });
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleDelete = () => {
    if (showDeleteConfirm) {
      deleteDream(id);
      router.back();
    } else {
      setShowDeleteConfirm(true);
    }
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
        <View style={styles.metaContainer}>
          <View style={styles.badgeContainer}>
            <View style={[styles.personaBadge, { backgroundColor: persona.color + '33' }]}>
              <Text style={[styles.personaText, { color: persona.color }]}>
                {persona.name}
              </Text>
            </View>
            {dream.dreamType && (
              <View style={[styles.dreamTypeBadge, { backgroundColor: dreamTypeColor + '33' }]}>
                <Text style={[styles.dreamTypeText, { color: dreamTypeColor }]}>
                  {dream.dreamType}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.date}>{formatDate(dream.date)}</Text>
        </View>
      </View>
      
      {dream.dreamType && (
        <View style={[styles.dreamTypeContainer, { borderLeftColor: dreamTypeColor }]}>
          <Text style={[styles.dreamTypeTitle, { color: dreamTypeColor }]}>
            {dream.dreamType}
          </Text>
          <Text style={styles.dreamTypeDescription}>
            {dreamTypeDescriptions[dream.dreamType]}
          </Text>
          {dream.rationale && (
            <Text style={styles.rationaleText}>
              {dream.rationale}
            </Text>
          )}
        </View>
      )}
      
      <View style={styles.dreamContainer}>
        <Text style={styles.sectionTitle}>Your Dream</Text>
        <Text style={styles.dreamText}>{dream.text}</Text>
      </View>
      
      <View style={styles.interpretationContainer}>
        <Text style={styles.sectionTitle}>
          {persona.name}'s Interpretation
        </Text>
        <Text style={styles.interpretationText}>{dream.interpretation}</Text>
      </View>
      
      <View style={styles.actionsContainer}>
        <Button
          label="Share Interpretation"
          onPress={handleShare}
          variant="outline"
          style={styles.shareButton}
          icon={<Share2 size={20} color={Colors.dark.primary} style={{ marginRight: 8 }} />}
        />
        
        <Pressable 
          style={[styles.deleteButton, showDeleteConfirm && styles.deleteConfirmButton]} 
          onPress={handleDelete}
        >
          <Trash2 size={24} color={showDeleteConfirm ? Colors.dark.error : Colors.dark.subtext} />
        </Pressable>
      </View>
      
      {showDeleteConfirm && (
        <Text style={styles.deleteConfirmText}>
          Tap the delete button again to confirm
        </Text>
      )}
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
  metaContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  personaBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  personaText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dreamTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dreamTypeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  date: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
  dreamTypeContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
  },
  dreamTypeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  dreamTypeDescription: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  rationaleText: {
    fontSize: 15,
    color: Colors.dark.text,
    lineHeight: 22,
    opacity: 0.9,
  },
  dreamContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  interpretationContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 12,
  },
  dreamText: {
    fontSize: 16,
    color: Colors.dark.text,
    lineHeight: 24,
  },
  interpretationText: {
    fontSize: 16,
    color: Colors.dark.text,
    lineHeight: 24,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  shareButton: {
    flex: 1,
    marginRight: 16,
  },
  deleteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dark.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteConfirmButton: {
    backgroundColor: Colors.dark.error + '33',
  },
  deleteConfirmText: {
    color: Colors.dark.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    color: Colors.dark.text,
    textAlign: 'center',
  },
});