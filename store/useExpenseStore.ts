import { create } from 'zustand';
import { db } from '@/db/client';
import { expenses } from '@/db/schema';
import { eq, gte, lt, and } from 'drizzle-orm';
import { useSettingsStore } from '@/store/useSettingsStore';
import { scheduleExpenseAlert } from "@/services/notifications";
import { Platform } from 'react-native';

type Expense = {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
};

type ExpenseStore = {
  items: Expense[];
  isLoading: boolean;
  fetchExpenses: () => Promise<void>;
  addExpense: (data: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
  deleteAllExpenses: () => Promise<void>;
  deleteFilteredExpenses: (year?: number, month?: number, day?: number) => Promise<void>;
  updateExpense: (id: number, data: Partial<Omit<Expense, 'id'>>) => Promise<void>;
  getTodayTotal: () => number;
};

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  items: [],
  isLoading: false,
  
  fetchExpenses: async () => {
    set({ isLoading: true });
    try {
      const data = await db.select().from(expenses).all();
      set({ items: data });
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Get total expenses for today
  getTodayTotal: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().items
      .filter(expense => expense.date.startsWith(today))
      .reduce((total, expense) => total + expense.amount, 0);
  },
  
  // Add a new expense
  addExpense: async (expense) => {
    set({ isLoading: true });
    try {
      // Insert the new expense
      await db.insert(expenses).values(expense).run();
      
      // Fetch updated expenses
      const updated = await db.select().from(expenses).all();
      set({ items: updated });
      
      // Check if expense alert is enabled
      if (Platform.OS !== 'web') {
        const { expenseAlertEnabled, alertThreshold } = useSettingsStore.getState();
        
        if (expenseAlertEnabled) {
          // Get today's expenses
          const today = new Date().toISOString().split('T')[0];
          const todayExpenses = updated.filter(e => e.date.startsWith(today));
          const total = todayExpenses.reduce((acc, e) => acc + e.amount, 0);
          
          // Send notification if threshold exceeded
          if (total > alertThreshold) {
            await scheduleExpenseAlert(alertThreshold, total);
          }
        }
      }
    } catch (error) {
      console.error('Failed to add expense:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Delete a specific expense
  deleteExpense: async (id) => {
    set({ isLoading: true });
    try {
      await db.delete(expenses).where(eq(expenses.id, id)).run();
      const updated = await db.select().from(expenses).all();
      set({ items: updated });
    } catch (error) {
      console.error('Failed to delete expense:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Delete all expenses
  deleteAllExpenses: async () => {
    set({ isLoading: true });
    try {
      await db.delete(expenses).run();
      set({ items: [] });
    } catch (error) {
      console.error('Failed to delete all expenses:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Delete expenses based on date filters
  deleteFilteredExpenses: async (year, month, day) => {
    set({ isLoading: true });
    try {
      // If year is undefined, delete everything
      if (year === undefined) {
        await db.delete(expenses).run();
        set({ items: [] });
        return;
      }
      
      // Build start/end ISO strings
      let start = `${year.toString().padStart(4, '0')}-01-01T00:00:00.000Z`;
      let end: string;
      
      if (month === undefined) {
        // Full year
        end = `${(year + 1).toString().padStart(4, '0')}-01-01T00:00:00.000Z`;
      } else if (day === undefined) {
        // Full month
        const m = (month + 1).toString().padStart(2, '0'); // month is 0-based
        const nextMonth = month === 11 ? '01' : (month + 2).toString().padStart(2, '0');
        const nextYear = month === 11 ? year + 1 : year;
        start = `${year.toString().padStart(4, '0')}-${m}-01T00:00:00.000Z`;
        end = `${nextYear.toString().padStart(4, '0')}-${nextMonth}-01T00:00:00.000Z`;
      } else {
        // Single day
        const m = (month + 1).toString().padStart(2, '0');
        const d = day.toString().padStart(2, '0');
        const date = `${year.toString().padStart(4, '0')}-${m}-${d}`;
        start = `${date}T00:00:00.000Z`;
        // Next day
        const next = new Date(new Date(date).getTime() + 86400000);
        end = next.toISOString();
      }
      
      // Delete filtered expenses
      await db
        .delete(expenses)
        .where(and(gte(expenses.date, start), lt(expenses.date, end)))
        .run();
      
      // Fetch updated expenses
      const updated = await db.select().from(expenses).all();
      set({ items: updated });
    } catch (error) {
      console.error('Failed to delete filtered expenses:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Update an existing expense
  updateExpense: async (id, updatedData) => {
    set({ isLoading: true });
    try {
      const existing = await db.select().from(expenses).where(eq(expenses.id, id)).get();
      
      if (!existing) return;
      
      const dataToUpdate = {
        ...existing,
        ...updatedData,
      };
      
      await db.update(expenses).set(dataToUpdate).where(eq(expenses.id, id)).run();
      
      const updated = await db.select().from(expenses).all();
      set({ items: updated });
    } catch (error) {
      console.error('Failed to update expense:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));