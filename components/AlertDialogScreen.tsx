import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
 
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from '@/components/ui/alert-dialog';
  import { Button } from '@/components/ui/button';
  import { Text } from '@/components/ui/text';

  type AlertDialogScreenProps = {
    TextShowAlert: string;
    Title: string;
    ActionContinue: () => void;
  };
  
export default  function AlertDialogScreen({
    TextShowAlert,
    Title,
    ActionContinue,
  }: AlertDialogScreenProps) {
    return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
           
            {TextShowAlert}
          
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure to {Title}?</AlertDialogTitle>
              
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                <Text>Cancel</Text>
              </AlertDialogCancel>
              <AlertDialogAction onPress={ActionContinue}>
                    <Text>Continue</Text>
                </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    );
  }