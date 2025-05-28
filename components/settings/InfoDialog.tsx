import React from 'react';
import { View ,Linking, TouchableOpacity } from 'react-native';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { FontAwesome } from '@expo/vector-icons';

interface InfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
}

export default function InfoDialog({ open, onOpenChange, title, content }: InfoDialogProps) {
    const isAbout = title.toLowerCase().includes('about');

  const handleLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open link:', err));
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <View className="py-2">
          <Text className="whitespace-pre-wrap">{content}</Text>
          {isAbout && (
            <View className="flex-row gap-12 mt-4 justify-center">
              <TouchableOpacity onPress={() => handleLink('https://github.com/AnicetJonhia')}>
                 <Text> <FontAwesome name="github" size={20} /></Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleLink('https://www.linkedin.com/in/anicet-jonhia-randrianambinina-266628244/')}>
                 <Text> <FontAwesome name="linkedin" size={20} /></Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleLink('https://www.facebook.com/anicet.jonhia/')}>
                 <Text> <FontAwesome name="facebook" size={20} /></Text>
              </TouchableOpacity>
            </View>
          )}
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
