import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { predefinedCategories } from '@/constants/categories';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: {
    category: string;
    dateRange: string;
    type: string;
  };
  onApplyFilters: (filters: any) => void;
}

const transactionTypes = [
  { id: 'all', name: 'All' },
  { id: 'income', name: 'Income' },
  { id: 'expense', name: 'Expense' },
];

const dateRanges = [
  { id: 'all', name: 'All Time' },
  { id: 'today', name: 'Today' },
  { id: 'week', name: 'This Week' },
  { id: 'month', name: 'This Month' },
  { id: 'year', name: 'This Year' },
];

export default function FilterModal({ visible, onClose, filters, onApplyFilters }: FilterModalProps) {
  const [localFilters, setLocalFilters] = React.useState(filters);
  
  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };
  
  const handleReset = () => {
    const resetFilters = {
      category: 'all',
      dateRange: 'all',
      type: 'all',
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Transactions</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </Pressable>
          </View>
          
          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Transaction Type</Text>
              <View style={styles.optionsContainer}>
                {transactionTypes.map((type) => (
                  <Pressable
                    key={type.id}
                    style={[
                      styles.option,
                      localFilters.type === type.id && styles.optionActive,
                    ]}
                    onPress={() => setLocalFilters({ ...localFilters, type: type.id })}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        localFilters.type === type.id && styles.optionTextActive,
                      ]}
                    >
                      {type.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Date Range</Text>
              <View style={styles.optionsContainer}>
                {dateRanges.map((range) => (
                  <Pressable
                    key={range.id}
                    style={[
                      styles.option,
                      localFilters.dateRange === range.id && styles.optionActive,
                    ]}
                    onPress={() => setLocalFilters({ ...localFilters, dateRange: range.id })}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        localFilters.dateRange === range.id && styles.optionTextActive,
                      ]}
                    >
                      {range.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.categoriesContainer}>
                <Pressable
                  style={[
                    styles.categoryOption,
                    localFilters.category === 'all' && styles.categoryOptionActive,
                  ]}
                  onPress={() => setLocalFilters({ ...localFilters, category: 'all' })}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      localFilters.category === 'all' && styles.categoryTextActive,
                    ]}
                  >
                    All
                  </Text>
                </Pressable>
                
                {predefinedCategories.map((category) => (
                  <Pressable
                    key={category.id}
                    style={[
                      styles.categoryOption,
                      localFilters.category === category.id && styles.categoryOptionActive,
                      { borderColor: category.color },
                    ]}
                    onPress={() => setLocalFilters({ ...localFilters, category: category.id })}
                  >
                    <View
                      style={[styles.categoryDot, { backgroundColor: category.color }]}
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        localFilters.category === category.id && {
                          color: category.color,
                          fontFamily: 'Inter-Medium',
                        },
                      ]}
                    >
                      {category.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.footer}>
            <Pressable style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </Pressable>
            <Pressable style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  option: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    margin: 4,
  },
  optionActive: {
    backgroundColor: colors.primary,
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  optionTextActive: {
    color: colors.white,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryOptionActive: {
    backgroundColor: colors.background,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  categoryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text,
  },
  categoryTextActive: {
    fontFamily: 'Inter-Medium',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginRight: 8,
  },
  resetButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text,
  },
  applyButton: {
    flex: 2,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
  },
  applyButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.white,
  },
});