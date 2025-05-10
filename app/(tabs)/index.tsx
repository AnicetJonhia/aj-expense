import * as React from 'react';
import { Button } from '@/components/ui/button';
import  { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Text } from '@/components/ui/text';
import DateFilter from '@/components/DateFilter';
import {View} from 'react-native'
import { formatDate } from "@/utils/formatDate";

const frameworks = [
  { label: 'Next.js', value: 'next.js' },
  { label: 'SvelteKit', value: 'sveltekit' },
  { label: 'Nuxt.js', value: 'nuxt.js' },
  { label: 'Remix', value: 'remix' },
  { label: 'Astro', value: 'astro' },
];
export default function Example() {
 
  const [selectedDate, setSelectedDate] = useState<string>('');
 
  
    const handleDateChange = (date: string) => {
      setSelectedDate(date);
    };
  return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline'>
            <Text>
          {selectedDate ? formatDate(selectedDate) : 'Filter'}</Text>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-fit p-6">
          <DialogHeader>
            <DialogTitle>Expense Filtration</DialogTitle>
            
          
            <DateFilter onDateChange={handleDateChange} />
              
           
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button>
                <Text>OK</Text>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}








