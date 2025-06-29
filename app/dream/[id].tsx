import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Share2, Trash2, Sparkles } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useDreamStore } from '@/store/dreamStore';
import { dreamThemes } from '@/constants/symbols';
import Button from '@/components/Button';

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
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const getThemeNames = () => {
    return dream.themes
      .map(themeId => {
        const theme = dreamThemes.find(t => t.id === themeId);
        return theme ? `${theme.symbol} ${theme.name}` : '';
      })
      .filter(Boolean);
  };
  
  const handleShare = async () => {
    try {
      await Share.share({
        title: dream.title,
        message: `Dream: ${dream.title}

${dream.content}

Recorded on ${formatDate(dream.date)}`,
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
  
  const handleViewAnalysis = () => {
    router.push({
      pathname: '/analysis',
      params: { dreamId: dream.id }
    });
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
        <Text style={styles.date}>{formatDate(dream.date)}</Text>
        <Text style={styles.title}>{dream.title}</Text>
        
        {dream.mood && (
          <View style={styles.moodContainer}>
            <Text style={styles.moodLabel}>Mood:</Text>
            <Text style={styles.moodText}>{dream.mood}</Text>
          </View>
        )}
        
        <View style={styles.badgeContainer}>
          {dream.isLucid && (
            <View style={[styles.badge, styles.lucidBadge]}>
              <Text style={styles.badgeText}>Lucid Dream</Text>
            </View>
          )}
          
          {dream.isRecurring && (
            <View style={[styles.badge, styles.recurringBadge]}>
              <Text style={styles.badgeText}>Recurring Dream</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.contentBox}>
        <Text style={styles.contentText}>{dream.content}</Text>
      </View>
      
      {(dream.symbols.length > 0 || dream.themes.length > 0) && (
        <View style={styles.symbolsThemesContainer}>
          {dream.symbols.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Symbols</Text>
              <Text style={styles.symbolsText}>{dream.symbols.join(' ')}</Text>
            </View>
          )}
          
          {dream.themes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Themes</Text>
              {getThemeNames().map((theme, index) => (
                <Text key={index} style={styles.themeItem}>{theme}</Text>
              ))}
            </View>
          )}
        </View>
      )}
      
      <View style={styles.actionsContainer}>
        <Button
          label="AI Analysis"
          onPress={handleViewAnalysis}
          style={styles.analyzeButton}
          icon={<Sparkles size={20} color={Colors.dark.background} />}
        />
        
        <View style={styles.iconButtonsContainer}>
          <Pressable style={styles.iconButton} onPress={handleShare}>
            <Share2 size={24} color={Colors.dark.text} />
          </Pressable>
          
          <Pressable 
            style={[styles.iconButton, showDeleteConfirm && styles.deleteConfirmButton]} 
            onPress={handleDelete}
          >
            <Trash2 size={24} color={showDeleteConfirm ? Colors.dark.error : Colors.dark.text} />
          </Pressable>
        </View>
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
  date: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 12,
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  moodLabel: {
    fontSize: 16,
    color: Colors.dark.subtext,
    marginRight: 8,
  },
  moodText: {
    fontSize: 16,
    color: Colors.dark.text,
    fontStyle: 'italic',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  lucidBadge: {
    backgroundColor: Colors.dark.primary + '33',
  },
  recurringBadge: {
    backgroundColor: Colors.dark.secondary + '33',
  },
  badgeText: {
    fontSize: 14,
    color: Colors.dark.text,
    fontWeight: '500',
  },
  contentBox: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  contentText: {
    fontSize: 16,
    color: Colors.dark.text,
    lineHeight: 24,
  },
  symbolsThemesContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  symbolsText: {
    fontSize: 24,
    color: Colors.dark.primary,
    letterSpacing: 4,
  },
  themeItem: {
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  analyzeButton: {
    flex: 1,
    marginRight: 16,
  },
  iconButtonsContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dark.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
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