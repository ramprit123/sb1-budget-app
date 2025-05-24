import React, { createContext, useContext, useEffect, useState } from 'react';

// Types
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  amount: number;
}

interface MonthlySummary {
  income: number;
  expenses: number;
  remaining: number;
  budget: number;
}

interface BudgetContextType {
  transactions: Transaction[];
  categories: Category[];
  monthlySummary: MonthlySummary;
  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  resetBudget: () => void;
}

// Sample data
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 3500,
    description: 'Monthly Salary',
    category: 'salary',
    date: new Date(2023, new Date().getMonth(), 1).toISOString(),
  },
  {
    id: '2',
    type: 'expense',
    amount: 850,
    description: 'Rent Payment',
    category: 'housing',
    date: new Date(2023, new Date().getMonth(), 3).toISOString(),
  },
  {
    id: '3',
    type: 'expense',
    amount: 120,
    description: 'Grocery Shopping',
    category: 'grocery',
    date: new Date(2023, new Date().getMonth(), 5).toISOString(),
  },
  {
    id: '4',
    type: 'expense',
    amount: 45,
    description: 'Movie Tickets',
    category: 'entertainment',
    date: new Date(2023, new Date().getMonth(), 8).toISOString(),
  },
  {
    id: '5',
    type: 'expense',
    amount: 35,
    description: 'Uber Ride',
    category: 'transport',
    date: new Date(2023, new Date().getMonth(), 10).toISOString(),
  },
  {
    id: '6',
    type: 'expense',
    amount: 78,
    description: 'Electricity Bill',
    category: 'utilities',
    date: new Date(2023, new Date().getMonth(), 15).toISOString(),
  },
  {
    id: '7',
    type: 'expense',
    amount: 65,
    description: 'Dinner at Restaurant',
    category: 'dining',
    date: new Date(2023, new Date().getMonth(), 18).toISOString(),
  },
  {
    id: '8',
    type: 'income',
    amount: 200,
    description: 'Freelance Work',
    category: 'freelance',
    date: new Date(2023, new Date().getMonth(), 20).toISOString(),
  },
];

// Create context
const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

// Provider component
export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  
  // Calculate category totals based on transactions
  const calculateCategories = (): Category[] => {
    const categoryMap = new Map<string, Category>();
    
    import('@/constants/categories').then(module => {
      const { predefinedCategories } = module;
      
      // Initialize all predefined categories with zero amount
      predefinedCategories.forEach(cat => {
        categoryMap.set(cat.id, {
          id: cat.id,
          name: cat.name,
          type: cat.type,
          color: cat.color,
          amount: 0,
        });
      });
      
      // Update amounts based on transactions
      transactions.forEach(transaction => {
        if (categoryMap.has(transaction.category)) {
          const category = categoryMap.get(transaction.category)!;
          categoryMap.set(transaction.category, {
            ...category,
            amount: category.amount + transaction.amount,
          });
        }
      });
    });
    
    return Array.from(categoryMap.values());
  };
  
  // Calculate monthly summary
  const calculateMonthlySummary = (): MonthlySummary => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });
    
    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    return {
      income,
      expenses,
      remaining: income - expenses,
      budget: 3000, // Hardcoded budget for sample
    };
  };
  
  const [categories, setCategories] = useState<Category[]>(calculateCategories());
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary>(calculateMonthlySummary());
  
  // Update derived state when transactions change
  useEffect(() => {
    setCategories(calculateCategories());
    setMonthlySummary(calculateMonthlySummary());
  }, [transactions]);
  
  // Context methods
  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };
  
  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };
  
  const updateTransaction = (id: string, updatedFields: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(t => (t.id === id ? { ...t, ...updatedFields } : t))
    );
  };
  
  const resetBudget = () => {
    setTransactions([]);
  };
  
  return (
    <BudgetContext.Provider
      value={{
        transactions,
        categories,
        monthlySummary,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        resetBudget,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

// Custom hook to use the budget context
export function useBudget() {
  const context = useContext(BudgetContext);
  
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  
  return context;
}