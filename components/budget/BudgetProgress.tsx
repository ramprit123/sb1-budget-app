import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { colors } from '@/constants/colors';

interface BudgetProgressProps {
  current: number;
  total: number;
}

export default function BudgetProgress({ current, total }: BudgetProgressProps) {
  const percentage = Math.min(current / total, 1);
  const animatedWidth = useSharedValue(0);
  
  // Color logic based on percentage
  const getStatusColor = () => {
    if (percentage < 0.5) return colors.success;
    if (percentage < 0.75) return colors.warning;
    return colors.error;
  };
  
  useEffect(() => {
    animatedWidth.value = withTiming(percentage, {
      duration: 1500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [percentage]);
  
  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedWidth.value * 100}%`,
    };
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Monthly Budget</Text>
        <Text style={styles.values}>
          ${current.toFixed(2)} 
          <Text style={styles.totalValue}>/ ${total.toFixed(2)}</Text>
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            { backgroundColor: getStatusColor() },
            progressStyle,
          ]}
        />
      </View>
      
      <Text style={styles.percentageText}>
        {Math.round(percentage * 100)}% of budget used
      </Text>
      
      <View style={styles.footer}>
        <Text style={styles.remainingText}>
          {percentage >= 1 
            ? 'Budget exceeded!'
            : `$${(total - current).toFixed(2)} remaining`}
        </Text>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text,
  },
  values: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text,
  },
  totalValue: {
    fontFamily: 'Inter-Regular',
    color: colors.textSecondary,
  },
  progressContainer: {
    height: 12,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  percentageText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  remainingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primary,
  },
});