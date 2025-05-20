import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useSettingsStore } from '@/store/useSettingsStore';

interface ThresholdDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function ThresholdDialog({ isOpen, setIsOpen }: ThresholdDialogProps) {
  const { alertThreshold, setAlertThreshold } = useSettingsStore();
  const [thresholdInput, setThresholdInput] = useState(alertThreshold.toString());
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setThresholdInput(alertThreshold.toString());
  }, [alertThreshold]);
  
  const handleSave = async () => {
    const numValue = Number(thresholdInput);
    if (isNaN(numValue)) {
      setError('Please enter a valid number');
      return;
    }
    if (numValue <= 0) {
      setError('Threshold must be greater than 0');
      return;
    }
    await setAlertThreshold(numValue);
    setIsOpen(false);
    setError(null);
  };
  
  const handleCancel = () => {
    setThresholdInput(alertThreshold.toString());
    setError(null);
    setIsOpen(false);
  };
  
  const handleChange = (text: string) => {
    if (text === '' || /^\d+$/.test(text)) {
      setThresholdInput(text);
      setError(null);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Expense Alert Threshold</DialogTitle>
        </DialogHeader>
        
        <View className="my-4">
          <Label nativeID="threshold-label">Alert Threshold (Ar)</Label>
          <Text className="text-sm text-gray-600 mb-2">
            You will be notified when your daily expenses exceed this amount.
          </Text>
          
          <Input
            nativeID="threshold-input"
            value={thresholdInput}
            onChangeText={handleChange}
            keyboardType="numeric"
            placeholder="Enter threshold amount"
            className={error ? 'border-red-500' : ''}
          />
          
          {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
          
          <Text className="text-xs mt-2 text-gray-500">
            Recommended: Set this to your typical daily budget
          </Text>
        </View>
        
        <DialogFooter>
          <View className="flex-row gap-2 ">
            <Button
              variant="outline"
              onPress={handleCancel}
              className='flex-1'
            >
              <Text>Cancel</Text>
            </Button>
            <Button
              variant="default"
              onPress={handleSave}
              className="flex-1"
            >
              <Text className="text-white font-medium">Save</Text>
            </Button>
          </View>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
