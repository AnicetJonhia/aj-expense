import React, { useState, useEffect, useMemo } from 'react'
import { View } from 'react-native'
import { Text } from '@/components/ui/text'
import { Card, CardContent } from '@/components/ui/card'
import { useExpenseStore } from '@/store/useExpenseStore'
import { format } from 'date-fns'
import { Combobox } from '@/components/ui/combobox'
import FontAwesome from '@expo/vector-icons/FontAwesome'

interface DashboardDateFilterProps {
  onChange: (dateString: string) => void
}

export default function DashboardDateFilter({ onChange }: DashboardDateFilterProps) {
  const { items, fetchExpenses } = useExpenseStore()

  const [year, setYear]   = useState<string>('all')
  const [month, setMonth] = useState<string | null>(null)
  const [day, setDay]     = useState<string | null>(null)

  useEffect(() => { fetchExpenses() }, [fetchExpenses])

  // années
  const years = useMemo(() => {
    const setY = new Set(
      items.map(i => new Date(i.date).getFullYear())
    )
    return [
      { label: 'All Years', value: 'all' },
      ...[...setY].sort((a, b) => b - a)
           .map(y => ({ label: String(y), value: String(y) }))
    ]
  }, [items])

  const totalYear = useMemo(() =>
    items.reduce((sum, i) => {
      const d = new Date(i.date)
      return year === 'all' || d.getFullYear() === Number(year)
        ? sum + i.amount
        : sum
    }, 0)
  , [items, year])

  // mois (1–12)
  const months = useMemo(() => {
    if (year === 'all') return []
    const setM = new Set<number>(
      items
        .filter(i => new Date(i.date).getFullYear() === Number(year))
        .map(i => new Date(i.date).getMonth() + 1) // ← +1
    )
    return [...setM]
      .sort((a, b) => a - b)
      .map(m => ({
        label: format(new Date(Number(year), m - 1, 1), 'MMMM'),
        value: String(m).padStart(2, '0'),
      }))
  }, [items, year])

  const totalMonth = useMemo(() => {
    if (year === 'all' || month == null) return 0
    return items.reduce((sum, i) => {
      const d = new Date(i.date)
      return (
        d.getFullYear() === Number(year) &&
        d.getMonth() + 1    === Number(month) // ← +1 ici aussi
      ) ? sum + i.amount : sum
    }, 0)
  }, [items, year, month])

  // jours
  const days = useMemo(() => {
    if (year === 'all' || month == null) return []
    const m0 = Number(month) - 1
    const setD = new Set<number>(
      items
        .filter(i => {
          const d = new Date(i.date)
          return (
            d.getFullYear() === Number(year) &&
            d.getMonth()   === m0
          )
        })
        .map(i => new Date(i.date).getDate())
    )
    return [...setD]
      .sort((a, b) => a - b)
      .map(dy => ({
        label: String(dy),
        value: String(dy).padStart(2, '0'),
      }))
  }, [items, year, month])

  const totalDay = useMemo(() => {
    if (year === 'all' || month == null || day == null) return 0
    return items.reduce((sum, i) => {
      const d = new Date(i.date)
      return (
        d.getFullYear() === Number(year) &&
        d.getMonth() + 1 === Number(month) &&
        d.getDate()     === Number(day)
      ) ? sum + i.amount : sum
    }, 0)
  }, [items, year, month, day])

  // dateString = "" | "YYYY" | "YYYY-MM" | "YYYY-MM-DD"
  const dateString = useMemo(() => {
    if (year === 'all') return ''
    if (!month)    return year
    if (!day)      return `${year}-${month}`
    return `${year}-${month}-${day}`
  }, [year, month, day])

  // on notifie le parent
  useEffect(() => {
    onChange(dateString)
  }, [dateString, onChange])

  return (
    <View className='mt-6'>
      <Text className="text-2xl font-bold mb-2">Filter by Date</Text>

      {/* Year */}
      <View className="mb-4">
        <Text className="text-sm mb-1 text-gray-600 dark:text-gray-400">
          Year
        </Text>
        <Combobox
          items={years}
          selectedItem={years.find(y => y.value === year) || null}
          onSelectedItemChange={opt => {
            setYear(opt.value)
            setMonth(null)
            setDay(null)
          }}
          placeholder="Select Year"
        />
        <Card className="mt-2 bg-gray-100 dark:bg-gray-900">
          <CardContent className="p-4 flex-row justify-between items-center">
            <View>
            <View className="flex-row gap-2 items-center">
              <Text><FontAwesome name="calendar" size={18} /></Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {year === 'all' ? 'All Years' : year}
              </Text>

              </View>
              <Text className="text-xl font-bold text-primary">
                {totalYear} Ar
              </Text>
              </View>
           
           
          </CardContent>
        </Card>
      </View>

      {/* Month & Day */}
      <View className=" flex-row gap-2">
        {year !== 'all' && (
          <View className="flex-1">
            <Text className="text-sm mb-1 text-gray-600 dark:text-gray-400">
              Month
            </Text>
            <Combobox
              items={months}
              selectedItem={months.find(m => m.value === month) || null}
              onSelectedItemChange={opt => {
                setMonth(opt.value)
                setDay(null)
              }}
              placeholder="Select Month"
              disabled={year === 'all'}
            />
            <Card className="mt-2 bg-gray-100 dark:bg-gray-900">
              <CardContent className="p-4 flex-row justify-between items-center">
               <View>
                <View className="flex-row gap-2 items-center">
                  <Text><FontAwesome name="calendar-o" size={18} /></Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    {month == null
                      ? '—'
                      : format(
                          new Date(
                            Number(year),
                            Number(month) - 1,
                            1
                          ),
                          'MMMM, yyyy'
                        )}
                  </Text>
                  </View>
                  <Text className="text-xl font-bold text-primary">
                    {totalMonth} Ar
                  </Text>
                
                  </View>
              </CardContent>
            </Card>
          </View>
        )}
        {month && (
          <View className="flex-1">
            <Text className="text-sm mb-1 text-gray-600 dark:text-gray-400">
              Day
            </Text>
            <Combobox
              items={days}
              selectedItem={days.find(d => d.value === day) || null}
              onSelectedItemChange={opt => setDay(opt.value)}
              placeholder="Select Day"
              disabled={month == null}
            />
            <Card className="mt-2 bg-gray-100 dark:bg-gray-900">
              <CardContent className="p-4 flex-row justify-between items-center">
                <View>
                <View className="flex-row gap-2 items-center">
                 <Text><FontAwesome name="calendar-check-o" size={18} /></Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    {day == null
                      ? '—'
                      : format(
                          new Date(
                            Number(year),
                            Number(month) - 1,
                            Number(day)
                          ),
                          'MMMM do, yyyy'
                        )}
                  </Text>
                  </View>
                  <Text className="text-xl font-bold text-primary">
                    {totalDay} Ar
                  </Text>
                </View>
               
              </CardContent>
            </Card>
          </View>
        )}
      </View>
    </View>
  )
}
