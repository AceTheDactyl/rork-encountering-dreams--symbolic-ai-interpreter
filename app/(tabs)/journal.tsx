import React, { useCallback, useState } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDreamStore } from '@/store/dreamStore';
import Colors from '@/constants/colors';
import DreamLogItem from '@/components/DreamLogItem';
import EmptyState from '@/components/EmptyState';
import SortButton from '@/components/SortButton';
import SortModal from '@/components/SortModal';

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const { getGroupedDreams, sortBy } = useDreamStore();
  const [refreshing, setRefreshing] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  
  const groupedDreams = getGroupedDreams();
  const totalDreams = groupedDreams.reduce((total, group) => total + group.dreams.length, 0);
  const isGrouped = sortBy === 'type' || sortBy === 'persona';
  
  // Flatten grouped dreams for FlatList
  const flattenedData = groupedDreams.flatMap(group => 
    group.dreams.map((dream, index) => ({
      ...dream,
      showGroupHeader: index === 0 && isGrouped,
      groupTitle: group.groupTitle
    }))
  );
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {totalDreams > 0 ? (
        <>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Dream Journal</Text>
              <SortButton onPress={() => setSortModalVisible(true)} />
            </View>
            <Text style={styles.headerSubtitle}>
              {totalDreams} dream{totalDreams !== 1 ? 's' : ''} recorded
              {isGrouped && ` • ${groupedDreams.length} group${groupedDreams.length !== 1 ? 's' : ''}`}
            </Text>
          </View>
          
          <FlatList
            data={flattenedData}
            renderItem={({ item }) => (
              <DreamLogItem 
                dream={item} 
                showGroupHeader={item.showGroupHeader}
                groupTitle={item.groupTitle}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.dark.primary}
                colors={[Colors.dark.primary]}
              />
            }
          />
        </>
      ) : (
        <EmptyState
          title="No dreams recorded"
          message="Visit the Spiralite tab to interpret your first dream and start building your personal dream journal."
        />
      )}
      
      <SortModal
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
  listContent: {
    padding: 16,
  },
});