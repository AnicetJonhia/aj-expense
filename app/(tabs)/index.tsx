
import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { useExpenseStore } from '@/store/useExpenseStore';
import { format } from 'date-fns';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import GlobalDashboard from '@/components/GlobalDashboard';
import DashboardFiltration from '@/components/DashboardFiltration';


export default function DashboardScreen() {
  

  return (
    <ScrollView className="flex-1 px-4 py-6 ">
      <GlobalDashboard/>
      <DashboardFiltration/>
    </ScrollView>

  );
}
