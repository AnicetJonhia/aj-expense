import { ToastContent } from '@/hooks/ToastContent';

export const toastConfig = {
  success: ({ text1, text2 }: any) => (
    <ToastContent type="success" text1={text1} text2={text2} />
  ),
  error: ({ text1, text2 }: any) => (
    <ToastContent type="error" text1={text1} text2={text2} />
  ),
};
