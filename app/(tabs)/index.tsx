import React, { useCallback } from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDreamStore } from '@/store/dreamStore';
import Colors from '@/constants/colors';
import DreamCard from '@/components/DreamCard';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/Button';

export default function JournalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = React.useState(false);
  const { dreams } = useDreamStore();
  
  const navigateToNewDream = () => {
    router.push('/new-dream');
  };
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // In a real app, you might fetch updated data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {dreams.length > 0 ? (
        <FlatList
          data={dreams}
          renderItem={({ item }) => <DreamCard dream={item} />}
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
          action={{
            label: "Record Dream",
            onPress: navigateToNewDream,
          }}
        />
      )}
      
      {dreams.length > 0 && (
        <View style={[styles.fabContainer, { bottom: insets.bottom + 16 }]}>
          <Button
            label="New Dream"
            onPress={navigateToNewDream}
            style={styles.fab}
            icon={<Plus size={20} color={Colors.dark.text} style={{ marginRight: 8 }} />}
          />
        </View>
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
  fabContainer: {
    position: 'absolute',
    right: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    borderRadius: 30,
    paddingHorizontal: 20,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});