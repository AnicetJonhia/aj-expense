import React, { useState, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { Dialog,DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Combobox } from '@/components/ui/combobox';
import { useExpenseStore } from '@/store/useExpenseStore';
import { format } from 'date-fns';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-toast-message';



type ComboboxItem = { label: string; value: string };

export default function ExportDialog({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const { items, fetchExpenses } = useExpenseStore();
  const [year, setYear] = useState<string>('all');
  const [month, setMonth] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);

  useEffect(() => { fetchExpenses(); }, []);

  // Generate combobox items
  const yearOptions: ComboboxItem[] = useMemo(() => {
    const years = Array.from(new Set(items.map(i => new Date(i.date).getFullYear()))).sort((a,b) => b - a);
    return [{ label: 'All Years', value: 'all' }, ...years.map(y => ({ label: String(y), value: String(y) }))];
  }, [items]);

  const monthOptions: ComboboxItem[] = useMemo(() => {
    if (year === 'all') return [];
    const months = Array.from(new Set(
      items
        .filter(i => new Date(i.date).getFullYear() === Number(year))
        .map(i => new Date(i.date).getMonth() + 1)
    )).sort((a,b) => a - b);
    return months.map(m => ({ label: format(new Date(Number(year), m - 1, 1), 'MMMM'), value: String(m).padStart(2,'0') }));
  }, [items, year]);

  const dayOptions: ComboboxItem[] = useMemo(() => {
    if (year === 'all' || !month) return [];
    const days = Array.from(new Set(
      items
        .filter(i => {
          const d = new Date(i.date);
          return d.getFullYear() === Number(year) && d.getMonth() + 1 === Number(month);
        })
        .map(i => new Date(i.date).getDate())
    )).sort((a,b) => a - b);
    return days.map(d => ({ label: String(d), value: String(d).padStart(2,'0') }));
  }, [items, year, month]);

  // Filter items
  const filtered = useMemo(() => {
    return items.filter(i => {
      const d = new Date(i.date);
      if (year !== 'all' && d.getFullYear() !== Number(year)) return false;
      if (month && d.getMonth() + 1 !== Number(month)) return false;
      if (day && d.getDate() !== Number(day)) return false;
      return true;
    });
  }, [items, year, month, day]);

  


  const handleExport = async () => {
    const dateNow = format(new Date(), 'yyyy-MM-dd');
    const fileName = `AJExpenseExportData_${dateNow}.pdf`;
    const newPath = `${FileSystem.cacheDirectory}${fileName}`;
    const message = `Data Export to ${String(fileName || 'your file')}`;


    const html = `
      <h1>Expenses Report</h1>
      <p>Filter: ${year}${month ? '-' + month : ''}${day ? '-' + day : ''}</p>
      <table border="1" style="width:100%;border-collapse:collapse;">
        <tr><th>Date</th><th>Title</th><th>Category</th><th>Amount</th></tr>
        ${filtered.map(e => `
          <tr>
            <td>${format(new Date(e.date), 'yyyy-MM-dd')}</td>
            <td>${e.title}</td>
            <td>${e.category}</td>
            <td>${e.amount}</td>
          </tr>`).join('')}
      </table>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });

      // Copier le fichier avec un nom personnalisé
      await FileSystem.copyAsync({
        from: uri,
        to: newPath,
      });

      // Partager le fichier renommé
    await Sharing.shareAsync(newPath, {
        mimeType: 'application/pdf',
        dialogTitle: `Share ${fileName}`,
      });
  
      setIsOpen(false);
      Toast.show({
        type: 'success',
        text1:  String(message),
        text2: "Your expenses were successfully exported"
      });

    }catch (error) {
       setIsOpen(false);
      Toast.show({
        type: 'error',
        text1: 'Export Failed',
        text2: String(error)
      });

    }

  };


  const handleExportCSV = async () => {
    try {
      const dateNow = format(new Date(), 'yyyy-MM-dd');
      const fileName = `AJExpenseExportData_${dateNow}.csv`;
      const newPath = `${FileSystem.cacheDirectory}${fileName}`;
       const message = `Data Export to ${String(fileName || 'your file')}`;

      // Échappement des guillemets
      const escapeQuotes = (str: string) => `"${str.replace(/"/g, '""')}"`;

      const csvHeader = 'Date,Title,Category,Amount\n';
      const csvRows = filtered.map(e => 
        [
          format(new Date(e.date), 'yyyy-MM-dd'),
          escapeQuotes(e.title),
          escapeQuotes(e.category),
          e.amount
        ].join(',')
      ).join('\n');

      const csvContent = csvHeader + csvRows;

      await FileSystem.writeAsStringAsync(newPath, csvContent, {
        encoding: FileSystem.EncodingType.UTF8
      });

      await Sharing.shareAsync(newPath, {
        mimeType: 'text/csv',
        dialogTitle: `Export CSV - ${dateNow}`,
      });
       setIsOpen(false);
      Toast.show({
        type: 'success',
        text1:  String(message),
        text2: "Your expenses were successfully exported"
      });


    } catch (error) {
       setIsOpen(false);
      Toast.show({
        type: 'error',
        text1: 'Export Failed',
        text2: error instanceof Error ? error.message : String(error)
      });
    }
  };


  
  


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      
      <DialogContent className="w-[90vw] max-w-screen-md sm:max-w-screen-sm p-4">
        <DialogHeader><DialogTitle>Export Expenses</DialogTitle></DialogHeader>
        <View className="flex-row gap-2">
          <View className='flex-1'>
          <Combobox  items={yearOptions} selectedItem={yearOptions.find(y=>y.value===year)||null} onSelectedItemChange={opt=>{setYear(opt.value); setMonth(null); setDay(null);}} placeholder="Year" />
          </View>
          {year!=='all' && 
          <View className='flex-1'>
            <Combobox items={monthOptions} selectedItem={monthOptions.find(m=>m.value===month)||null} onSelectedItemChange={opt=>{setMonth(opt.value); setDay(null);}} placeholder="Month" />
        </View>}
          {month &&
          <View className='flex-1'> <Combobox items={dayOptions} selectedItem={dayOptions.find(d=>d.value===day)||null} onSelectedItemChange={opt=>setDay(opt.value)} placeholder="Day" />
          </View>
          }
        </View>
        <DialogFooter>
          <View className='flex-row  gap-2'>
         
          <Button variant="outline" onPress={handleExportCSV}>
            <Text>Export as CSV</Text>
          </Button>
          <Button className='flex-1' onPress={handleExport} disabled={filtered.length===0}><Text>Export as PDF</Text></Button>
          
          </View>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
