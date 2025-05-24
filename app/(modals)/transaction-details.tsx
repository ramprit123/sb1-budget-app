import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X, CreditCard as Edit2, Trash } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { colors } from '@/constants/colors';
import { useBudget } from '@/context/BudgetContext';
import { formatDate, formatTime } from '@/utils/dateUtils';
import { getCategoryById } from '@/utils/categoryUtils';

export default function TransactionDetailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { transactions, deleteTransaction } = useBudget();
  
  const transaction = transactions.find(t => t.id === id);
  
  if (!transaction) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Not Found</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Transaction not found</Text>
        </View>
      </View>
    );
  }
  
  const category = getCategoryById(transaction.category);
  
  const handleDelete = () => {
    deleteTransaction(transaction.id);
    router.back();
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Transaction Details</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <Animated.View entering={FadeIn.duration(400)} style={styles.content}>
        <View 
          style={[
            styles.amountCard, 
            { 
              backgroundColor: transaction.type === 'income' 
                ? colors.success + '15'
                : colors.error + '15'
            }
          ]}
        >
          <Text style={styles.transactionType}>
            {transaction.type === 'income' ? 'Income' : 'Expense'}
          </Text>
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
            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.detailValue}>{transaction.description}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <View style={styles.categoryContainer}>
              <View
                style={[styles.categoryDot, { backgroundColor: category?.color || colors.textSecondary }]}
              />
              <Text style={styles.detailValue}>{category?.name || 'Uncategorized'}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>
              {formatDate(new Date(transaction.date))}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>
              {formatTime(new Date(transaction.date))}
            </Text>
          </View>
        </View>
      </Animated.View>
      
      <View style={[styles.actions, { paddingBottom: insets.bottom || 16 }]}>
        <Pressable style={styles.editButton}>
          <Edit2 size={20} color={colors.primary} />
          <Text style={styles.editButtonText}>Edit</Text>
        </Pressable>
        
        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Trash size={20} color={colors.white} />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textSecondary,
  },
  amountCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  transactionType: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  amount: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
  },
  detailsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
  },
  detailValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
  },
  editButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.primary,
    marginLeft: 8,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    borderRadius: 12,
    paddingVertical: 16,
  },
  deleteButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.white,
    marginLeft: 8,
  },
});