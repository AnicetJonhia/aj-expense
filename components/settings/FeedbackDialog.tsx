import React, { useState } from 'react';
import { View } from 'react-native';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import Toast from 'react-native-toast-message';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!validateEmail(email)) newErrors.email = 'Invalid email address';
    if (!message.trim()) newErrors.message = 'Message is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: process.env.EMAILJS_SERVICE_ID,
          template_id: process.env.EMAILJS_TEMPLATE_ID,
          user_id: process.env.EMAILJS_PUBLIC_KEY,
          template_params: {
            name,
            email,
            message,
          }
        })
      });

      if (!response.ok) throw new Error('Failed to send email');

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: "Message sent successfully! I'll get back to you soon."
      });

      // Reset form
      setName('');
      setEmail('');
      setMessage('');
      setErrors({});
      onOpenChange(false);
    } catch (error) {
        console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to send message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
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
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrors(prev => ({ ...prev, name: '' }));
              }}
            />
            {errors.name && <Text className="text-red-500 text-sm mt-1">{errors.name}</Text>}
          </View>

          <View>
            <Label>Email *</Label>
            <Input
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors(prev => ({ ...prev, email: '' }));
              }}
            />
            {errors.email && <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>}
          </View>

          <View>
            <Label>Message *</Label>
            <Textarea
              value={message}
              onChangeText={(text) => {
                setMessage(text);
                setErrors(prev => ({ ...prev, message: '' }));
              }}
              className="h-32"
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