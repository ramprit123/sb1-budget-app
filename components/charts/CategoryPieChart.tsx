import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VictoryPie, VictoryLegend } from 'victory-native';
import { Svg } from 'react-native-svg';

import { colors } from '@/constants/colors';
import { useBudget } from '@/context/BudgetContext';
import { predefinedCategories } from '@/constants/categories';

export default function CategoryPieChart() {
  const { transactions } = useBudget();
  
  const generateChartData = () => {
    // Group transactions by category and calculate totals
    const categoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const { category, amount } = transaction;
        
        if (!acc[category]) {
          acc[category] = 0;
        }
        
        acc[category] += amount;
        return acc;
      }, {} as Record<string, number>);
    
    // Convert to pie chart data format
    const data = Object.entries(categoryTotals)
      .map(([categoryId, amount]) => {
        const category = predefinedCategories.find(c => c.id === categoryId);
        return {
          x: category?.name || 'Other',
          y: amount,
          color: category?.color || colors.other,
        };
      })
      .filter(item => item.y > 0)
      .sort((a, b) => b.y - a.y);
    
    return data;
  };
  
  const pieData = generateChartData();
  
  // Create legend data
  const legendData = pieData.map(item => ({
    name: `${item.x} - $${item.y.toFixed(0)}`,
    symbol: { fill: item.color },
  }));
  
  // Calculate total
  const total = pieData.reduce((sum, item) => sum + item.y, 0);
  
  // Check if there's any data to display
  if (pieData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No expense data available</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg width={180} height={180}>
          <VictoryPie
            data={pieData}
            width={180}
            height={180}
            colorScale={pieData.map(item => item.color)}
            innerRadius={40}
            labelRadius={({ innerRadius }) => (innerRadius || 0) + 30}
            labels={() => null}
            padAngle={2}
            style={{
              data: {
                stroke: colors.card,
                strokeWidth: 2,
              },
            }}
          />
        </Svg>
        <View style={styles.totalContainer}>
          <Text style={styles.totalAmount}>${total.toFixed(0)}</Text>
          <Text style={styles.totalLabel}>Total</Text>
        </View>
      </View>
      
      <View style={styles.legendContainer}>
        <VictoryLegend
          data={legendData}
          orientation="vertical"
          gutter={10}
          style={{
            labels: {
              fill: colors.text,
              fontFamily: 'Inter-Regular',
              fontSize: 12,
            },
          }}
        />
      </View>
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
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
  },
  noDataText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  totalContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.text,
  },
  totalLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
  },
  legendContainer: {
    marginTop: 20,
    paddingHorizontal: 8,
  },
});