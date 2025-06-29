import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  ScrollView, 
  Switch,
  KeyboardAvoidingView,
  Platform,
  Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useDreamStore } from '@/store/dreamStore';
import { detectSymbols, detectThemes } from '@/utils/dreamAnalysis';
import Button from '@/components/Button';
import SymbolPicker from '@/components/SymbolPicker';
import ThemePicker from '@/components/ThemePicker';

export default function NewDreamScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addDream } = useDreamStore();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [isLucid, setIsLucid] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [symbols, setSymbols] = useState<string[]>([]);
  const [themes, setThemes] = useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleContentChange = (text: string) => {
    setContent(text);
    
    // Auto-detect symbols and themes
    if (text.length > 20) {
      const detectedSymbols = detectSymbols(text);
      const detectedThemes = detectThemes(text);
      
      if (detectedSymbols.length > 0) {
        setSymbols(prev => {
          const combined = [...prev, ...detectedSymbols];
          return [...new Set(combined)]; // Remove duplicates
        });
      }
      
      if (detectedThemes.length > 0) {
        setThemes(prev => {
          const combined = [...prev, ...detectedThemes];
          return [...new Set(combined)]; // Remove duplicates
        });
      }
    }
  };
  
  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      // Show error - would add proper validation in a real app
      return;
    }
    
    setIsSubmitting(true);
    
    const newDream = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      date: new Date().toISOString(),
      mood: mood.trim(),
      symbols,
      themes,
      isLucid,
      isRecurring,
    };
    
    addDream(newDream);
    
    // Simulate a brief loading state
    setTimeout(() => {
      setIsSubmitting(false);
      router.back();
    }, 500);
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + 20 }
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Record Your Dream</Text>
          <Pressable onPress={handleCancel} style={styles.closeButton}>
            <X size={24} color={Colors.dark.text} />
          </Pressable>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Dream Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Give your dream a title..."
            placeholderTextColor={Colors.dark.subtext}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Dream Description</Text>
          <TextInput
            style={styles.textArea}
            value={content}
            onChangeText={handleContentChange}
            placeholder="Describe your dream in detail..."
            placeholderTextColor={Colors.dark.subtext}
            multiline
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Mood / Emotion</Text>
          <TextInput
            style={styles.input}
            value={mood}
            onChangeText={setMood}
            placeholder="How did you feel in the dream?"
            placeholderTextColor={Colors.dark.subtext}
          />
        </View>
        
        <SymbolPicker
          selectedSymbols={symbols}
          onSymbolsChange={setSymbols}
        />
        
        <ThemePicker
          selectedThemes={themes}
          onThemesChange={setThemes}
        />
        
        <View style={styles.switchContainer}>
          <View style={styles.switchItem}>
            <Text style={styles.switchLabel}>Lucid Dream</Text>
            <Switch
              value={isLucid}
              onValueChange={setIsLucid}
              trackColor={{ false: Colors.dark.border, true: Colors.dark.primary + '80' }}
              thumbColor={isLucid ? Colors.dark.primary : Colors.dark.subtext}
            />
          </View>
          
          <View style={styles.switchItem}>
            <Text style={styles.switchLabel}>Recurring Dream</Text>
            <Switch
              value={isRecurring}
              onValueChange={setIsRecurring}
              trackColor={{ false: Colors.dark.border, true: Colors.dark.secondary + '80' }}
              thumbColor={isRecurring ? Colors.dark.secondary : Colors.dark.subtext}
            />
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            label="Cancel"
            onPress={handleCancel}
            variant="outline"
            style={styles.button}
          />
          <Button
            label="Save Dream"
            onPress={handleSave}
            isLoading={isSubmitting}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  closeButton: {
    padding: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 8,
    padding: 12,
    color: Colors.dark.text,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 8,
    padding: 12,
    color: Colors.dark.text,
    fontSize: 16,
    minHeight: 150,
  },
  switchContainer: {
    marginBottom: 24,
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});