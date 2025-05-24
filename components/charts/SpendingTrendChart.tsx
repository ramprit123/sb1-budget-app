import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryArea, VictoryScatter } from 'victory-native';

import { colors } from '@/constants/colors';
import { useBudget } from '@/context/BudgetContext';

interface SpendingTrendChartProps {
  timeRange: string;
}

export default function SpendingTrendChart({ timeRange }: SpendingTrendChartProps) {
  const { transactions } = useBudget();
  
  const generateChartData = () => {
    // Filter transactions based on time range
    const now = new Date();
    const filteredTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      
      if (timeRange === 'week') {
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return transactionDate >= oneWeekAgo;
      } else if (timeRange === 'month') {
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return transactionDate >= oneMonthAgo;
      } else if (timeRange === 'year') {
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return transactionDate >= oneYearAgo;
      }
      
      return true;
    });
    
    // Generate data points
    const expenseData = [];
    
    if (timeRange === 'week') {
      // Group by day of week
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      for (let i = 0; i < 7; i++) {
        const dayIndex = (now.getDay() - 6 + i + 7) % 7;
        const dayName = days[dayIndex];
        
        const dayTransactions = filteredTransactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate.getDay() === dayIndex;
        });
          
        const expenseAmount = dayTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        expenseData.push({ x: dayName, y: expenseAmount });
      }
    } else if (timeRange === 'month') {
      // Group by week
      const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      
      for (let i = 0; i < 4; i++) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
        const weekEnd = new Date(now);
        weekEnd.setDate(weekEnd.getDate() - i * 7);
        
        const weekTransactions = filteredTransactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= weekStart && transactionDate < weekEnd;
        });
          
        const expenseAmount = weekTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        expenseData.unshift({ x: weekLabels[i], y: expenseAmount });
      }
    } else if (timeRange === 'year') {
      // Group by month
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for (let i = 0; i < 6; i++) {
        const monthIndex = (now.getMonth() - 5 + i + 12) % 12;
        const monthName = months[monthIndex];
        
        const monthTransactions = filteredTransactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate.getMonth() === monthIndex;
        });
          
        const expenseAmount = monthTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        expenseData.push({ x: monthName, y: expenseAmount });
      }
    }
    
    return expenseData;
  };
  
  const expenseData = generateChartData();
  
  // Check if there's any data to display
  const hasData = expenseData.some(d => d.y > 0);
  
  if (!hasData) {
    return (
      <View style={styles.container}>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No data available for this time period</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <VictoryChart
        height={220}
        padding={{ top: 20, bottom: 30, left: 60, right: 20 }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: colors.border },
            tickLabels: { 
              fill: colors.textSecondary,
              fontFamily: 'Inter-Regular',
              fontSize: 10,
              padding: 5,
            },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: colors.border },
            tickLabels: { 
              fill: colors.textSecondary,
              fontFamily: 'Inter-Regular',
              fontSize: 10,
              padding: 5,
            },
          }}
        />
        <VictoryArea
          data={expenseData}
          style={{
            data: { 
              fill: colors.primary + '30',
              stroke: colors.primary,
              strokeWidth: 2,
            },
          }}
          animate={{
            duration: 2000,
            onLoad: { duration: 1000 }
          }}
        />
        <VictoryScatter
          data={expenseData}
          size={5}
          style={{
            data: {
              fill: colors.white,
              stroke: colors.primary,
              strokeWidth: 2,
            },
          }}
        />
      </VictoryChart>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    height: 280,
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
});