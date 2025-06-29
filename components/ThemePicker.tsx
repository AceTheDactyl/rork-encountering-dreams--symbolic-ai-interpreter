import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Modal } from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { dreamThemes } from '@/constants/symbols';
import Button from '@/components/Button';

interface ThemePickerProps {
  selectedThemes: string[];
  onThemesChange: (themes: string[]) => void;
}

export default function ThemePicker({ selectedThemes, onThemesChange }: ThemePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempSelectedThemes, setTempSelectedThemes] = useState<string[]>([]);
  
  const openModal = () => {
    setTempSelectedThemes([...selectedThemes]);
    setModalVisible(true);
  };
  
  const closeModal = () => {
    setModalVisible(false);
  };
  
  const saveSelection = () => {
    onThemesChange(tempSelectedThemes);
    closeModal();
  };
  
  const toggleTheme = (themeId: string) => {
    if (tempSelectedThemes.includes(themeId)) {
      setTempSelectedThemes(tempSelectedThemes.filter(id => id !== themeId));
    } else {
      setTempSelectedThemes([...tempSelectedThemes, themeId]);
    }
  };
  
  const removeTheme = (themeId: string) => {
    onThemesChange(selectedThemes.filter(id => id !== themeId));
  };
  
  const getThemeName = (themeId: string) => {
    const theme = dreamThemes.find(t => t.id === themeId);
    return theme ? theme.name : '';
  };
  
  const getThemeSymbol = (themeId: string) => {
    const theme = dreamThemes.find(t => t.id === themeId);
    return theme ? theme.symbol : '';
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Dream Themes</Text>
      
      <View style={styles.selectedContainer}>
        {selectedThemes.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectedThemesContainer}
          >
            {selectedThemes.map(themeId => (
              <Pressable 
                key={themeId} 
                style={styles.selectedTheme}
                onPress={() => removeTheme(themeId)}
              >
                <Text style={styles.themeText}>
                  {getThemeSymbol(themeId)} {getThemeName(themeId)}
                </Text>
                <X size={14} color={Colors.dark.text} style={styles.removeIcon} />
              </Pressable>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.placeholder}>No themes selected</Text>
        )}
        
        <Button
          label="Add"
          variant="outline"
          size="small"
          onPress={openModal}
          style={styles.addButton}
        />
      </View>
      
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Themes</Text>
              <Pressable onPress={closeModal}>
                <X size={24} color={Colors.dark.text} />
              </Pressable>
            </View>
            
            <ScrollView style={styles.themesContainer}>
              {dreamThemes.map(theme => (
                <Pressable
                  key={theme.id}
                  style={[
                    styles.themeItem,
                    tempSelectedThemes.includes(theme.id) && styles.selectedThemeItem
                  ]}
                  onPress={() => toggleTheme(theme.id)}
                >
                  <Text style={styles.themeItemSymbol}>{theme.symbol}</Text>
                  <Text style={styles.themeItemText}>{theme.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <Button
                label="Cancel"
                variant="outline"
                onPress={closeModal}
                style={styles.modalButton}
              />
              <Button
                label="Save"
                onPress={saveSelection}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  selectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  selectedThemesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    gap: 8,
  },
  selectedTheme: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.secondary + '33',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  themeText: {
    fontSize: 14,
    color: Colors.dark.text,
    marginRight: 4,
  },
  removeIcon: {
    marginLeft: 2,
  },
  placeholder: {
    color: Colors.dark.subtext,
    flex: 1,
  },
  addButton: {
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.dark.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  themesContainer: {
    flex: 1,
  },
  themeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: Colors.dark.card,
  },
  selectedThemeItem: {
    backgroundColor: Colors.dark.secondary + '33',
    borderWidth: 1,
    borderColor: Colors.dark.secondary,
  },
  themeItemSymbol: {
    fontSize: 20,
    marginRight: 12,
    color: Colors.dark.text,
  },
  themeItemText: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});