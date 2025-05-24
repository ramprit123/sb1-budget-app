import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CirclePlus as PlusCircle } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

import { colors } from '@/constants/colors';
import { useBudget } from '@/context/BudgetContext';
import Header from '@/components/common/Header';
import BudgetSummary from '@/components/budget/BudgetSummary';
import TransactionList from '@/components/transaction/TransactionList';
import BudgetProgress from '@/components/budget/BudgetProgress';
import CategoryBreakdown from '@/components/budget/CategoryBreakdown';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { transactions, monthlySummary } = useBudget();
  const [isNavigating, setIsNavigating] = useState(false);
  
  const recentTransactions = transactions.slice(0, 5);
  
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
      <Header title="My Budget" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <BudgetSummary 
            income={monthlySummary.income}
            expenses={monthlySummary.expenses}
            remaining={monthlySummary.remaining}
          />
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Monthly Budget</Text>
          </View>
          <BudgetProgress
            current={monthlySummary.expenses}
            total={monthlySummary.budget}
          />
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Category Breakdown</Text>
          </View>
          <CategoryBreakdown />
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <Pressable
              onPress={() => router.push('/(tabs)/transactions')}
              hitSlop={10}
            >
              <Text style={styles.viewAll}>View All</Text>
            </Pressable>
          </View>
          <TransactionList 
            transactions={recentTransactions}
            showHeader={false}
          />
        </Animated.View>
      </ScrollView>
      
      <Animated.View 
        style={[styles.addButton, { bottom: insets.bottom + 84 }]}
        entering={FadeInRight.delay(600).duration(400)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.text,
  },
  viewAll: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primary,
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