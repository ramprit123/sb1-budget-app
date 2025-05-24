import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { useBudget } from '@/context/BudgetContext';

export default function CategoryBreakdown() {
  const { categories } = useBudget();
  
  // Filter expense categories and sort by amount (descending)
  const expenseCategories = categories
    .filter(cat => cat.type === 'expense' && cat.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4);
  
  // Calculate total expense amount
  const totalExpenses = expenseCategories.reduce((sum, cat) => sum + cat.amount, 0);
  
  if (expenseCategories.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No expense data available</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {expenseCategories.map((category) => {
        const percentage = totalExpenses > 0 ? (category.amount / totalExpenses) * 100 : 0;
        
        return (
          <View key={category.id} style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <View style={styles.nameContainer}>
                <View 
                  style={[styles.categoryDot, { backgroundColor: category.color }]} 
                />
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>
              <View>
                <Text style={styles.categoryAmount}>${category.amount.toFixed(2)}</Text>
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    width: `${percentage}%`,
                    backgroundColor: category.color,
                  }
                ]} 
              />
            </View>
            
            <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  categoryName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text,
  },
  categoryAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.text,
  },
  progressContainer: {
    height: 8,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: 16,
  },
});