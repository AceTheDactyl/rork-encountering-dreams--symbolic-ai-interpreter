import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Modal } from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { dreamSymbols } from '@/constants/symbols';
import Button from '@/components/Button';

interface SymbolPickerProps {
  selectedSymbols: string[];
  onSymbolsChange: (symbols: string[]) => void;
}

export default function SymbolPicker({ selectedSymbols, onSymbolsChange }: SymbolPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempSelectedSymbols, setTempSelectedSymbols] = useState<string[]>([]);
  
  const openModal = () => {
    setTempSelectedSymbols([...selectedSymbols]);
    setModalVisible(true);
  };
  
  const closeModal = () => {
    setModalVisible(false);
  };
  
  const saveSelection = () => {
    onSymbolsChange(tempSelectedSymbols);
    closeModal();
  };
  
  const toggleSymbol = (symbol: string) => {
    if (tempSelectedSymbols.includes(symbol)) {
      setTempSelectedSymbols(tempSelectedSymbols.filter(s => s !== symbol));
    } else {
      setTempSelectedSymbols([...tempSelectedSymbols, symbol]);
    }
  };
  
  const removeSymbol = (symbol: string) => {
    onSymbolsChange(selectedSymbols.filter(s => s !== symbol));
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Dream Symbols</Text>
      
      <View style={styles.selectedContainer}>
        {selectedSymbols.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectedSymbolsContainer}
          >
            {selectedSymbols.map(symbol => (
              <Pressable 
                key={symbol} 
                style={styles.selectedSymbol}
                onPress={() => removeSymbol(symbol)}
              >
                <Text style={styles.symbolText}>{symbol}</Text>
                <X size={14} color={Colors.dark.text} style={styles.removeIcon} />
              </Pressable>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.placeholder}>No symbols selected</Text>
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
              <Text style={styles.modalTitle}>Select Symbols</Text>
              <Pressable onPress={closeModal}>
                <X size={24} color={Colors.dark.text} />
              </Pressable>
            </View>
            
            <ScrollView style={styles.symbolsGrid}>
              <View style={styles.gridContainer}>
                {dreamSymbols.map(symbolObj => (
                  <Pressable
                    key={symbolObj.symbol}
                    style={[
                      styles.symbolItem,
                      tempSelectedSymbols.includes(symbolObj.symbol) && styles.selectedSymbolItem
                    ]}
                    onPress={() => toggleSymbol(symbolObj.symbol)}
                  >
                    <Text style={styles.symbolItemText}>{symbolObj.symbol}</Text>
                    <Text style={styles.symbolName}>{symbolObj.name}</Text>
                  </Pressable>
                ))}
              </View>
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
  selectedSymbolsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    gap: 8,
  },
  selectedSymbol: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.primary + '33',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  symbolText: {
    fontSize: 16,
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
  symbolsGrid: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  symbolItem: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    marginBottom: 12,
    padding: 8,
  },
  selectedSymbolItem: {
    backgroundColor: Colors.dark.primary + '33',
    borderWidth: 1,
    borderColor: Colors.dark.primary,
  },
  symbolItemText: {
    fontSize: 28,
    marginBottom: 4,
    color: Colors.dark.text,
  },
  symbolName: {
    fontSize: 12,
    color: Colors.dark.subtext,
    textAlign: 'center',
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