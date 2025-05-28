import React from 'react';


import { Text } from '@/components/ui/text';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import {  View  } from 'react-native';
import {Button} from '@/components/ui/button';

interface TabHeaderProps {
    title: string,
    onAddPress: () => void;
  }

export default function TabHeader ({ title, onAddPress }: TabHeaderProps) {
    


    return  (

            <View className="flex flex-row items-center border-b border-gray-300 dark:border-gray-600 pb-0.5 ">
                <Text className="text-xl font-bold">{title}</Text>
             
                <Button  className="ml-auto" onPress={onAddPress}>
                    <Text><FontAwesome name="plus" size={12} /></Text>
                </Button>
                    
          
            </View>
           

    )
}


  
  