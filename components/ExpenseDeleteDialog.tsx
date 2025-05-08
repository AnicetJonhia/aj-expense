import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
  } from '@/components/ui/alert-dialog';
  import { Text } from '@/components/ui/text';
  
  export default function ExpenseDeleteDialog({
    isOpen,
    setIsOpen,
    onConfirm,
  }: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    onConfirm: () => void;
  }) {
    return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this expense?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onPress={() => setIsOpen(false)}>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction
              onPress={() => {
                setIsOpen(false);
                onConfirm();
              }}
            >
              <Text>Continue</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  