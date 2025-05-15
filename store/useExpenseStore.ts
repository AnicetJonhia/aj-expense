import { create } from 'zustand';
import { db } from '@/db/client';
import { expenses } from '@/db/schema';
import { eq, gte, lt, and } from 'drizzle-orm';

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
    deleteFilteredExpenses: (year?: number, month?: number, day?: number) => Promise<void>;
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




  deleteFilteredExpenses: async (year, month, day) => {
    // if year is _exactly_ undefined, delete everything
    if (year === undefined) {
      await db.delete(expenses).run();
      set({ items: [] });
      return;
    }

    // build start/end ISO strings
    let start = `${year.toString().padStart(4, '0')}-01-01T00:00:00.000Z`;
    let end: string;

    if (month === undefined) {
      // full year
      end = `${(year + 1).toString().padStart(4, '0')}-01-01T00:00:00.000Z`;
    } else if (day === undefined) {
      // full month
      const m = (month + 1).toString().padStart(2, '0'); // month is 0-based
      const nextMonth = month === 11 ? '01' : (month + 2).toString().padStart(2, '0');
      const nextYear = month === 11 ? year + 1 : year;
      start = `${year.toString().padStart(4, '0')}-${m}-01T00:00:00.000Z`;
      end = `${nextYear.toString().padStart(4, '0')}-${nextMonth}-01T00:00:00.000Z`;
    } else {
      // single day
      const m = (month + 1).toString().padStart(2, '0');
      const d = day.toString().padStart(2, '0');
      const date = `${year.toString().padStart(4, '0')}-${m}-${d}`;
      start = `${date}T00:00:00.000Z`;
      // next day
      const next = new Date(new Date(date).getTime() + 86400000);
      end = next.toISOString();
    }

     await db
      .delete(expenses)
      .where(and(gte(expenses.date, start), lt(expenses.date, end)))
      .run();

     const updated = await db.select().from(expenses).all();
    set({ items: updated });

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
