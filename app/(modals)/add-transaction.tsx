import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, CheckCheck } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { colors } from '@/constants/colors';
import { useBudget } from '@/context/BudgetContext';
import { predefinedCategories } from '@/constants/categories';
import { formatDate } from '@/utils/dateUtils';

export default function AddTransactionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addTransaction } = useBudget();
  
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  
  const handleSave = () => {
    if (!amount || !description || !category) {
      return; // Show validation error
    }
    
    const newTransaction = {
      id: Date.now().toString(),
      type,
      amount: parseFloat(amount),
      description,
      category,
      date: date.toISOString(),
    };
    
    addTransaction(newTransaction);
    router.back();
  };
  
  const filteredCategories = predefinedCategories.filter(cat => cat.type === type);
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top || 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Add Transaction</Text>
        <Pressable onPress={handleSave} style={styles.saveButton}>
          <CheckCheck size={24} color={colors.primary} />
        </Pressable>
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Animated.View entering={FadeInUp.delay(100).duration(300)} style={styles.typeSelector}>
          <Pressable
            style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
            onPress={() => setType('expense')}
          >
            <Text
              style={[styles.typeText, type === 'expense' && styles.typeTextActive]}
            >
              Expense
            </Text>
          </Pressable>
          <Pressable
            style={[styles.typeButton, type === 'income' && styles.typeButtonActive]}
            onPress={() => setType('income')}
          >
            <Text
              style={[styles.typeText, type === 'income' && styles.typeTextActive]}
            >
              Income
            </Text>
          </Pressable>
        </Animated.View>
        
        <Animated.View entering={FadeInUp.delay(200).duration(300)} style={styles.inputGroup}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInUp.delay(300).duration(300)} style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="What was this for?"
            placeholderTextColor={colors.textSecondary}
          />
        </Animated.View>
        
        <Animated.View entering={FadeInUp.delay(400).duration(300)} style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          <Pressable style={styles.input}>
            <Text style={styles.dateText}>{formatDate(date)}</Text>
          </Pressable>
        </Animated.View>
        
        <Animated.View entering={FadeInUp.delay(500).duration(300)} style={styles.categoriesContainer}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoriesList}>
            {filteredCategories.map((cat) => (
              <Pressable
                key={cat.id}
                style={[
                  styles.categoryItem,
                  category === cat.id && { backgroundColor: cat.color + '20' }
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <View 
                  style={[
                    styles.categoryIcon, 
                    { backgroundColor: cat.color }
                  ]}
                >
                  <Text style={styles.categoryIconText}>
                    {cat.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.categoryName}>{cat.name}</Text>
                {category === cat.id && (
                  <View style={[styles.categoryCheckmark, { backgroundColor: cat.color }]}>
                    <CheckCheck size={12} color={colors.white} />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
      
      <Animated.View 
        entering={FadeInUp.delay(600).duration(300)}
        style={[styles.bottomBar, { paddingBottom: insets.bottom || 16 }]}
      >
        <Pressable 
          style={styles.addButton} 
          onPress={handleSave}
          disabled={!amount || !description || !category}
        >
          <Text style={styles.addButtonText}>Save Transaction</Text>
        </Pressable>
      </Animated.View>
    </KeyboardAvoidingView>
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
    paddingBottom: 8,
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
  saveButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  typeButtonActive: {
    backgroundColor: colors.card,
  },
  typeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textSecondary,
  },
  typeTextActive: {
    color: colors.text,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontFamily: 'Inter-Medium',
    fontSize: 24,
    color: colors.text,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 14,
    fontFamily: 'Inter-Regular',
    fontSize: 24,
    color: colors.text,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryItem: {
    width: '30%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    margin: 4,
    backgroundColor: colors.card,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryIconText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.white,
  },
  categoryName: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  categoryCheckmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.white,
  },
});