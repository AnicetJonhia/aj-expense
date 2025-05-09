import * as React from "react";


import { Text } from '@/components/ui/text';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import {  View  } from 'react-native';
import {Button} from '@/components/ui/button'

export default function ExpenseListHeader () {
    return  (
        <View className="flex flex-row items-center ">
            <Text className="text-xl font-bold">My Expenses</Text>
            <Link href="/add" asChild  className="ml-auto">
                <Button>
                    <Text><FontAwesome name="plus" size={12} /></Text>
                </Button>
                
            </Link>
        </View>
    )
}