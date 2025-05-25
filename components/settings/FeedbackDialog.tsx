import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import Toast from 'react-native-toast-message';
import { send, EmailJSResponseStatus } from '@emailjs/react-native';
import Constants from 'expo-constants';



const { 
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY 
} = Constants.expoConfig?.extra || {};

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
  console.log('EmailJS Config:', EMAILJS_PUBLIC_KEY);
}, []);
  // Réinitialisation quand le dialogue se ferme
  useEffect(() => {
    if (!open) {
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
    }
  }, [open]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);


    try {
      await send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        // "service_jwmiol1",
        // "template_l3n140k",

        {
            name: formData.name,
            email: formData.email,
            message: formData.message,
        },
        {
            publicKey: EMAILJS_PUBLIC_KEY,
            // publicKey :  "jd60YkdGTUeodk7QX",
        }
        );

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: "Message sent successfully! I'll get back to you soon."
      });

      onOpenChange(false); 
      
    } catch (error) {
      console.error("Error :", error);
      if (error instanceof EmailJSResponseStatus) {
        console.error('EmailJS Request Failed...', error);
        Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'EmailJS Request Failed...'+ error
      });
      }
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to send message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof formData) => (text: string) => {
    setFormData(prev => ({ ...prev, [field]: text }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-screen-md sm:max-w-screen-sm p-4">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
        </DialogHeader>

        <View className="space-y-4">
          <View>
            <Label>Name *</Label>
            <Input
              value={formData.name}
              onChangeText={handleChange('name')}
            />
            {errors.name && <Text className="text-red-500 text-sm mt-1">{errors.name}</Text>}
          </View>

          <View>
            <Label>Email *</Label>
            <Input
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={handleChange('email')}
            />
            {errors.email && <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>}
          </View>

          <View>
            <Label>Message *</Label>
            <Textarea
              value={formData.message}
              onChangeText={handleChange('message')}
              className="h-16"
              placeholder="Type your message here..."
              textAlignVertical="top"
            />
            {errors.message && <Text className="text-red-500 text-sm mt-1">{errors.message}</Text>}
          </View>
        </View>

        <DialogFooter>
          <View className="flex-row gap-2 mt-4">
            <Button 
              variant="outline" 
              className="flex-1" 
              onPress={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              <Text>Cancel</Text>
            </Button>
            <Button 
              className="flex-1" 
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text>{isSubmitting ? 'Sending...' : 'Send'}</Text>
            </Button>
          </View>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}