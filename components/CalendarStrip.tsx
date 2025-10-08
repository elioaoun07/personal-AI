import React from 'react';
import { Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import dayjs from 'dayjs';

interface CalendarStripProps {
  selectedDate: number;
  onDateSelect: (date: number) => void;
}

export function CalendarStrip({ selectedDate, onDateSelect }: CalendarStripProps) {
  const dates = [];
  const startDate = dayjs().subtract(7, 'day');
  
  for (let i = 0; i < 30; i++) {
    dates.push(startDate.add(i, 'day'));
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {dates.map((date) => {
        const timestamp = date.valueOf();
        const isSelected = dayjs(selectedDate).isSame(date, 'day');
        const isToday = dayjs().isSame(date, 'day');

        return (
          <TouchableOpacity
            key={timestamp}
            style={[
              styles.dateItem,
              isSelected && styles.dateItemSelected,
              isToday && !isSelected && styles.dateItemToday,
            ]}
            onPress={() => onDateSelect(timestamp)}
          >
            <Text
              style={[
                styles.dayName,
                isSelected && styles.textSelected,
              ]}
            >
              {date.format('ddd')}
            </Text>
            <Text
              style={[
                styles.dayNumber,
                isSelected && styles.textSelected,
                isToday && !isSelected && styles.textToday,
              ]}
            >
              {date.format('D')}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  dateItem: {
    width: 60,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  dateItemSelected: {
    backgroundColor: '#007AFF',
  },
  dateItemToday: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  dayName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  textSelected: {
    color: '#FFF',
  },
  textToday: {
    color: '#007AFF',
  },
});
