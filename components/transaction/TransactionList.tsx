import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';

import { colors } from '@/constants/colors';
import { Transaction } from '@/context/BudgetContext';
import { getCategoryById } from '@/utils/categoryUtils';
import TransactionItem from './TransactionItem';

interface TransactionListProps {
  transactions: Transaction[];
  showHeader?: boolean;
}

interface TransactionsByDate {
  title: string;
  data: Transaction[];
}

export default function TransactionList({ transactions, showHeader = true }: TransactionListProps) {
  const router = useRouter();
  
  const groupTransactionsByDate = (): TransactionsByDate[] => {
    const grouped = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!acc[dateKey]) {
        acc[dateKey] = {
          title: format(date, 'EEEE, MMMM d, yyyy'),
          data: [],
        };
      }
      
      acc[dateKey].data.push(transaction);
      return acc;
    }, {} as Record<string, TransactionsByDate>);
    
    return Object.values(grouped);
  };
  
  const transactionsByDate = groupTransactionsByDate();
  
  const handleTransactionPress = (id: string) => {
    router.push({
      pathname: '/(modals)/transaction-details',
      params: { id },
    });
  };
  
  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No transactions found</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {showHeader && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Recent Transactions</Text>
        </View>
      )}
      
      {transactionsByDate.map((group, index) => (
        <View key={group.title} style={styles.dateGroup}>
          <Text style={styles.dateHeader}>{group.title}</Text>
          
          {group.data.map((transaction, idx) => (
            <TransactionItem 
              key={transaction.id}
              transaction={transaction}
              onPress={() => handleTransactionPress(transaction.id)}
              isLast={idx === group.data.length - 1}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.text,
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
  },
});