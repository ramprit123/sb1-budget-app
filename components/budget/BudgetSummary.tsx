import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors } from '@/constants/colors';

interface BudgetSummaryProps {
  income: number;
  expenses: number;
  remaining: number;
}

export default function BudgetSummary({ income, expenses, remaining }: BudgetSummaryProps) {
  const animatedValue = useSharedValue(0);
  
  React.useEffect(() => {
    animatedValue.value = withTiming(1, { duration: 1000 });
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedValue.value,
      transform: [{ translateY: (1 - animatedValue.value) * 20 }],
    };
  });
  
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>${remaining.toFixed(2)}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: colors.success + '20' }]}>
            <ArrowUpRight size={18} color={colors.success} />
          </View>
          <View>
            <Text style={styles.statLabel}>Income</Text>
            <Text style={styles.statAmount}>${income.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: colors.error + '20' }]}>
            <ArrowDownRight size={18} color={colors.error} />
          </View>
          <View>
            <Text style={styles.statLabel}>Expenses</Text>
            <Text style={styles.statAmount}>${expenses.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  balanceAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  statAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
});