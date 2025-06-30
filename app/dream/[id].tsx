import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Share, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Share2, Trash2, Copy, Download } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import Colors from '@/constants/colors';
import { useDreamStore } from '@/store/dreamStore';
import { getPersona } from '@/constants/personas';
import { getDreamType } from '@/constants/dreamTypes';
import { ExportService } from '@/services/exportService';
import Button from '@/components/Button';

export default function DreamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getDream, deleteDream } = useDreamStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
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
  const dreamType = getDreamType(dream.dreamType);
  
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
  
  const getShareContent = () => {
    return `${dream.name}

My Dream (${dreamType?.name || 'Unknown Type'}):

${dream.text}

${persona.name}'s Interpretation:

${dream.interpretation}

Interpreted on ${formatDate(dream.date)}`;
  };
  
  const handleShare = async () => {
    const shareContent = getShareContent();
    
    try {
      if (Platform.OS === 'web') {
        // For web, try navigator.share first, then fallback to clipboard
        if (navigator.share && navigator.canShare && navigator.canShare({ text: shareContent })) {
          await navigator.share({
            title: dream.name,
            text: shareContent,
          });
        } else {
          // Fallback to clipboard for web
          await handleCopyToClipboard();
        }
      } else {
        // For mobile platforms, use React Native's Share API
        await Share.share({
          title: dream.name,
          message: shareContent,
        });
      }
    } catch (error: any) {
      console.error('Share error:', error);
      
      // If sharing fails, offer to copy to clipboard instead
      if (error.name === 'NotAllowedError' || error.name === 'AbortError') {
        Alert.alert(
          'Share Not Available',
          'Would you like to copy the interpretation to your clipboard instead?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Copy', onPress: handleCopyToClipboard }
          ]
        );
      } else {
        // For other errors, just copy to clipboard
        await handleCopyToClipboard();
      }
    }
  };
  
  const handleCopyToClipboard = async () => {
    try {
      const shareContent = getShareContent();
      await Clipboard.setStringAsync(shareContent);
      
      if (Platform.OS === 'web') {
        // For web, show a simple alert
        alert('Dream interpretation copied to clipboard!');
      } else {
        Alert.alert('Copied!', 'Dream interpretation copied to clipboard');
      }
    } catch (error) {
      console.error('Clipboard error:', error);
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  const handleExportDream = async () => {
    setIsExporting(true);
    try {
      await ExportService.exportSingleDream(dream);
      Alert.alert('Success', 'Dream exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Export Failed', 'Unable to export dream. Please try again.');
    } finally {
      setIsExporting(false);
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
        <Text style={styles.dreamTitle}>{dream.name}</Text>
        <View style={styles.metaContainer}>
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
          <Text style={styles.date}>{formatDate(dream.date)}</Text>
        </View>
      </View>
      
      {dreamType && (
        <View style={styles.dreamTypeInfoContainer}>
          <Text style={styles.dreamTypeInfoTitle}>Dream Classification</Text>
          <View style={styles.dreamTypeInfoGrid}>
            <View style={styles.dreamTypeInfoItem}>
              <Text style={styles.dreamTypeInfoLabel}>Time Index:</Text>
              <Text style={styles.dreamTypeInfoValue}>{dreamType.timeIndex}</Text>
            </View>
            <View style={styles.dreamTypeInfoItem}>
              <Text style={styles.dreamTypeInfoLabel}>Function:</Text>
              <Text style={styles.dreamTypeInfoValue}>{dreamType.primaryFunction}</Text>
            </View>
            <View style={styles.dreamTypeInfoItem}>
              <Text style={styles.dreamTypeInfoLabel}>Symbolic Field:</Text>
              <Text style={styles.dreamTypeInfoValue}>{dreamType.symbolicField}</Text>
            </View>
            <View style={styles.dreamTypeInfoItem}>
              <Text style={styles.dreamTypeInfoLabel}>Phenomena:</Text>
              <Text style={styles.dreamTypeInfoValue}>{dreamType.typicalPhenomena}</Text>
            </View>
          </View>
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
          label="Share"
          onPress={handleShare}
          variant="outline"
          style={styles.actionButton}
          icon={<Share2 size={18} color={Colors.dark.primary} />}
        />
        
        <Button
          label="Export"
          onPress={handleExportDream}
          variant="outline"
          style={styles.actionButton}
          isLoading={isExporting}
          icon={<Download size={18} color={Colors.dark.primary} />}
        />
        
        <Pressable 
          style={styles.iconButton}
          onPress={handleCopyToClipboard}
        >
          <Copy size={20} color={Colors.dark.subtext} />
        </Pressable>
        
        <Pressable 
          style={[styles.iconButton, showDeleteConfirm && styles.deleteConfirmButton]} 
          onPress={handleDelete}
        >
          <Trash2 size={20} color={showDeleteConfirm ? Colors.dark.error : Colors.dark.subtext} />
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
  dreamTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 16,
    lineHeight: 30,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badgeContainer: {
    flex: 1,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dreamTypeSymbol: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  dreamTypeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  date: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginLeft: 16,
    textAlign: 'right',
  },
  dreamTypeInfoContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  dreamTypeInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 12,
  },
  dreamTypeInfoGrid: {
    gap: 8,
  },
  dreamTypeInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dreamTypeInfoLabel: {
    fontSize: 14,
    color: Colors.dark.subtext,
    flex: 1,
  },
  dreamTypeInfoValue: {
    fontSize: 14,
    color: Colors.dark.text,
    flex: 2,
    textAlign: 'right',
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
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconButton: {
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