import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryGroup, VictoryLegend } from 'victory-native';

import { colors } from '@/constants/colors';
import { useBudget } from '@/context/BudgetContext';

interface ExpenseChartProps {
  timeRange: string;
}

export default function ExpenseChart({ timeRange }: ExpenseChartProps) {
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
    const incomeData = [];
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
        
        const incomeAmount = dayTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
          
        const expenseAmount = dayTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        incomeData.push({ x: dayName, y: incomeAmount });
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
        
        const incomeAmount = weekTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
          
        const expenseAmount = weekTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        incomeData.unshift({ x: weekLabels[i], y: incomeAmount });
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
        
        const incomeAmount = monthTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
          
        const expenseAmount = monthTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        incomeData.push({ x: monthName, y: incomeAmount });
        expenseData.push({ x: monthName, y: expenseAmount });
      }
    }
    
    return { incomeData, expenseData };
  };
  
  const { incomeData, expenseData } = generateChartData();
  
  // Check if there's any data to display
  const hasData = incomeData.some(d => d.y > 0) || expenseData.some(d => d.y > 0);
  
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
        <VictoryLegend
          x={125}
          y={10}
          orientation="horizontal"
          gutter={20}
          data={[
            { name: 'Income', symbol: { fill: colors.success } },
            { name: 'Expenses', symbol: { fill: colors.error } }
          ]}
          style={{
            labels: { 
              fill: colors.text,
              fontFamily: 'Inter-Regular',
              fontSize: 10,
            }
          }}
        />
        <VictoryGroup
          offset={12}
          colorScale={[colors.success, colors.error]}
        >
          <VictoryBar
            data={incomeData}
            cornerRadius={{ topLeft: 4, topRight: 4 }}
            barWidth={10}
          />
          <VictoryBar
            data={expenseData}
            cornerRadius={{ topLeft: 4, topRight: 4 }}
            barWidth={10}
          />
        </VictoryGroup>
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