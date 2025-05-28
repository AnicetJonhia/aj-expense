import React from 'react';
import { View } from 'react-native';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

interface InfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
}

export default function InfoDialog({ open, onOpenChange, title, content }: InfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <View className="py-2">
          <Text className="whitespace-pre-wrap">{content}</Text>
        </View>
        <DialogFooter>
          <Button onPress={() => onOpenChange(false)}>
            <Text>Close</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
