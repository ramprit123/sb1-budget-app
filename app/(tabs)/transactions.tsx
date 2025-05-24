import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Filter, CirclePlus as PlusCircle } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { colors } from '@/constants/colors';
import { useBudget } from '@/context/BudgetContext';
import Header from '@/components/common/Header';
import TransactionList from '@/components/transaction/TransactionList';
import FilterModal from '@/components/transaction/FilterModal';

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { transactions } = useBudget();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    dateRange: 'all',
    type: 'all',
  });
  
  const filteredTransactions = transactions.filter(transaction => {
    // Search query filter
    if (searchQuery && !transaction.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (filters.category !== 'all' && transaction.category !== filters.category) {
      return false;
    }
    
    // Type filter (income/expense)
    if (filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }
    
    // Date range filter would be implemented here
    
    return true;
  });
  
  const handleAddTransaction = useCallback(() => {
    if (isNavigating) return;
    setIsNavigating(true);
    
    router.push('/(modals)/add-transaction');
    
    // Reset navigation state after a delay
    setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  }, [router, isNavigating]);
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Transactions" />
      
      <Animated.View style={styles.searchContainer} entering={FadeInDown.delay(100).duration(400)}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        <Pressable 
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Filter size={20} color={colors.text} />
        </Pressable>
      </Animated.View>
      
      <Animated.View style={styles.contentContainer} entering={FadeInDown.delay(200).duration(400)}>
        <TransactionList 
          transactions={filteredTransactions}
          showHeader={true}
        />
      </Animated.View>
      
      <Animated.View 
        style={[styles.addButton, { bottom: insets.bottom + 16 + (Platform.OS === 'ios' ? 68 : 48) }]}
        entering={FadeInDown.delay(300).duration(400)}
      >
        <Pressable 
          onPress={handleAddTransaction} 
          style={[
            styles.addButtonInner,
            isNavigating && styles.addButtonDisabled
          ]}
          disabled={isNavigating}
        >
          <PlusCircle size={24} color={colors.white} />
          <Text style={styles.addButtonText}>Add Transaction</Text>
        </Pressable>
      </Animated.View>
      
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApplyFilters={setFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: colors.text,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: colors.card,
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  addButton: {
    position: 'absolute',
    right: 16,
    backgroundColor: colors.primary,
    borderRadius: 28,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: colors.white,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
});