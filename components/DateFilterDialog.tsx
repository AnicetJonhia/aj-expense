import * as React from 'react';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import DateFilter from '@/components/DateFilter';

interface DateFilterDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleDateChange: (params: { date?: string; category?: string }) => void;
}

export default function DateFilterDialog({
  isOpen,
  setIsOpen,
  handleDateChange,
}: DateFilterDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[90vw] max-w-screen-md sm:max-w-screen-sm p-4">
        <DialogHeader>
          <DialogTitle>Expense Filtration</DialogTitle>
        </DialogHeader>

        <DateFilter onDateChange={handleDateChange} />

        <DialogFooter>
          <DialogClose asChild>
            <Button>
              <Text>Filter</Text>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
