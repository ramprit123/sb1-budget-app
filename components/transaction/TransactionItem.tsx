import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { format } from 'date-fns';

import { colors } from '@/constants/colors';
import { Transaction } from '@/context/BudgetContext';
import { getCategoryById } from '@/utils/categoryUtils';

interface TransactionItemProps {
  transaction: Transaction;
  onPress: () => void;
  isLast?: boolean;
}

export default function TransactionItem({ transaction, onPress, isLast = false }: TransactionItemProps) {
  const category = getCategoryById(transaction.category);
  
  return (
    <Pressable 
      style={[styles.container, isLast && styles.lastItem]} 
      onPress={onPress}
    >
      <View 
        style={[
          styles.categoryIcon, 
          { backgroundColor: category?.color || colors.other }
        ]}
      >
        <Text style={styles.categoryIconText}>
          {category?.name.charAt(0).toUpperCase() || 'O'}
        </Text>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description} numberOfLines={1}>
            {transaction.description}
          </Text>
          <Text style={styles.category}>{category?.name || 'Other'}</Text>
        </View>
        
        <View style={styles.amountContainer}>
          <Text 
            style={[
              styles.amount, 
              { 
                color: transaction.type === 'income' 
                  ? colors.success 
                  : colors.error 
              }
            ]}
          >
            {transaction.type === 'income' ? '+' : '-'}
            ${transaction.amount.toFixed(2)}
          </Text>
          <Text style={styles.time}>
            {format(new Date(transaction.date), 'h:mm a')}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  lastItem: {
    marginBottom: 0,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryIconText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.white,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  descriptionContainer: {
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  category: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  time: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
  },
});