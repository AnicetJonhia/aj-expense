import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';

export default function ExpenseDeleteDialog({
  isOpen,
  setIsOpen,
  onConfirm,
  itemTitle,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onConfirm: () => void;
  itemTitle: string;
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="w-[90vw] max-w-screen-md sm:max-w-screen-sm p-4">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete *{itemTitle}*?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete  *{itemTitle}*? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <View className='  flex-row  gap-2'>
          <AlertDialogCancel className='flex-1' onPress={() => setIsOpen(false)}>
            <Text>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction className='flex-1'
            onPress={() => {
              setIsOpen(false);
              onConfirm();
            }}
          >
            <Text>Continue</Text>
          </AlertDialogAction>
          </View>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
