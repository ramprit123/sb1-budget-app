import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { colors } from '@/constants/colors';
import { useBudget } from '@/context/BudgetContext';
import Header from '@/components/common/Header';
import ExpenseChart from '@/components/charts/ExpenseChart';
import CategoryPieChart from '@/components/charts/CategoryPieChart';
import SpendingTrendChart from '@/components/charts/SpendingTrendChart';

const timeRanges = ['Week', 'Month', 'Year'];

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const { transactions, categories } = useBudget();
  const [selectedTimeRange, setSelectedTimeRange] = useState('Month');
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Insights" />
      
      <View style={styles.timeRangeContainer}>
        {timeRanges.map((range) => (
          <Pressable
            key={range}
            style={[
              styles.timeRangeButton,
              selectedTimeRange === range && styles.timeRangeButtonActive
            ]}
            onPress={() => setSelectedTimeRange(range)}
          >
            <Text
              style={[
                styles.timeRangeText,
                selectedTimeRange === range && styles.timeRangeTextActive
              ]}
            >
              {range}
            </Text>
          </Pressable>
        ))}
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Income vs Expenses</Text>
          </View>
          <ExpenseChart timeRange={selectedTimeRange.toLowerCase()} />
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spending by Category</Text>
          </View>
          <CategoryPieChart />
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spending Trend</Text>
          </View>
          <SpendingTrendChart timeRange={selectedTimeRange.toLowerCase()} />
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Spending Categories</Text>
          </View>
          <View style={styles.topCategoriesContainer}>
            {categories
              .filter(cat => cat.type === 'expense')
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 3)
              .map((category, index) => (
                <View key={category.id} style={styles.topCategoryItem}>
                  <View style={[styles.categoryRank, { backgroundColor: category.color }]}>
                    <Text style={styles.categoryRankText}>{index + 1}</Text>
                  </View>
                  <View style={styles.categoryDetails}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryAmount}>${category.amount.toFixed(2)}</Text>
                  </View>
                  <View style={styles.categoryPercentage}>
                    <Text style={styles.percentageText}>
                      {Math.round((category.amount / categories
                        .filter(c => c.type === 'expense')
                        .reduce((sum, c) => sum + c.amount, 0)) * 100)}%
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  timeRangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  timeRangeButtonActive: {
    backgroundColor: colors.primary,
  },
  timeRangeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  timeRangeTextActive: {
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.text,
  },
  topCategoriesContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  topCategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryRankText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: colors.white,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text,
    marginBottom: 2,
  },
  categoryAmount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  categoryPercentage: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  percentageText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text,
  },
});