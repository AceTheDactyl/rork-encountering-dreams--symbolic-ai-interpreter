import React, { useCallback } from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDreamStore } from '@/store/dreamStore';
import Colors from '@/constants/colors';
import DreamLogItem from '@/components/DreamLogItem';
import EmptyState from '@/components/EmptyState';

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const { dreams } = useDreamStore();
  const [refreshing, setRefreshing] = React.useState(false);
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {dreams.length > 0 ? (
        <FlatList
          data={dreams}
          renderItem={({ item }) => <DreamLogItem dream={item} />}
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
      ) : (
        <EmptyState
          title="No dreams recorded"
          message="Visit the Spiralite tab to interpret your first dream and start building your personal dream journal."
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  listContent: {
    padding: 16,
  },
});