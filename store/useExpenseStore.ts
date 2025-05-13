import { create } from 'zustand';
import { db } from '@/db/client';
import { expenses } from '@/db/schema';
import { eq } from 'drizzle-orm';

type Expense = {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
};

type ExpenseStore = {
    items: Expense[];
    fetchExpenses: () => Promise<void>;
    addExpense: (data: Omit<Expense, 'id'>) => Promise<void>;
    deleteExpense: (id: number) => Promise<void>;
    deleteAllExpenses: () => Promise<void>;
    updateExpense: (id: number, data: Partial<Omit<Expense, 'id'>>) => Promise<void>;
  };
  

export const useExpenseStore = create<ExpenseStore>((set) => ({
  items: [],

  fetchExpenses: async () => {
    const data = await db.select().from(expenses).all();
    set({ items: data });
  },

  addExpense: async (expense) => {
    await db.insert(expenses).values(expense).run();
    const updated = await db.select().from(expenses).all();
    set({ items: updated });
  },

  deleteExpense: async (id) => {
    await db.delete(expenses).where(eq(expenses.id, id)).run();
    const updated = await db.select().from(expenses).all();
    set({ items: updated });
  },

  deleteAllExpenses: async () => {
    await db.delete(expenses).run();
    set({ items: [] });
  },
  updateExpense: async (id, updatedData) => {
  
    const existing = await db.select().from(expenses).where(eq(expenses.id, id)).get();
  
    if (!existing) return;

    const dataToUpdate = {
      ...existing,
      ...updatedData,
    };
  

    await db.update(expenses).set(dataToUpdate).where(eq(expenses.id, id)).run();

    const updated = await db.select().from(expenses).all();
    set({ items: updated });
  },
  
  
}));
