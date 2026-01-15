import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const CustomCalendar = ({ 
  selectedDate, 
  onDateSelect, 
  minDate, 
  maxDate, 
  blockedDates = [], 
  studentAppointmentDates = [],
  visible,
  onClose 
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1) : new Date()
  );
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isDateBlocked = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${dayOfMonth}`;
    
    return blockedDates.includes(dateString);
  };

  const hasStudentAppointment = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${dayOfMonth}`;
    
    return studentAppointmentDates.find(apt => apt.date === dateString);
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };


const isDateDisabled = (date) => {
  const today = new Date();
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (checkDate < todayDateOnly) {
    return true;
  }
  
  if (minDate) {
    const minDateOnly = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
    if (checkDate < minDateOnly) return true;
  }
  
  if (maxDate) {
    const maxDateOnly = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
    if (checkDate > maxDateOnly) return true;
  }
  
  if (isWeekend(date)) return true;
  
  if (isDateBlocked(date)) return true;
  
  if (hasStudentAppointment(date)) return true;
  
  return false;
};


const getDateBlockReason = (date) => {
  const today = new Date();
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (checkDate < todayDateOnly) {
    return { type: 'past', message: 'Past dates are not available' };
  }
  
  if (isWeekend(date)) {
    return { type: 'weekend', message: 'Weekends are not available' };
  }
  
  if (isDateBlocked(date)) {
    return { type: 'blocked', message: 'Counselor is unavailable on this date' };
  }
  
  const appointment = hasStudentAppointment(date);
  if (appointment) {
    return { 
      type: 'has-appointment', 
      message: `You already have an appointment at ${appointment.time}`,
      time: appointment.time
    };
  }
  
  return null;
};

  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const goToPreviousMonth = () => {
    const today = new Date();
    const currentMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const todayMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
    
    if (currentMonthDate > todayMonthDate) {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    }
  };

  const goToNextMonth = () => {
    const today = new Date();
    const nextMonthLimit = new Date(today.getFullYear(), today.getMonth() + 2, 1);
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    
    if (nextMonth < nextMonthLimit) {
      setCurrentMonth(nextMonth);
    }
  };

  const canGoPrevious = () => {
    const today = new Date();
    const currentMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const todayMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
    return currentMonthDate > todayMonthDate;
  };

  const canGoNext = () => {
    const today = new Date();
    const nextMonthLimit = new Date(today.getFullYear(), today.getMonth() + 2, 1);
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    return nextMonth < nextMonthLimit;
  };

  const handleDatePress = (date) => {
    const blockReason = getDateBlockReason(date);
    
    if (blockReason) {
      setSelectedDateInfo({
        date: date,
        reason: blockReason
      });
      
      setTimeout(() => {
        setSelectedDateInfo(null);
      }, 3000);
    } else {
      console.log('Selected date:', date);
      setSelectedDateInfo(null);
      onDateSelect(date);
      onClose();
    }
  };

  const days = getDaysInMonth();
  const today = new Date();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={calendarStyles.overlay}>
        <View style={calendarStyles.container}>
          {/* Header */}
          <View style={calendarStyles.header}>
            <Text style={calendarStyles.headerTitle}>Select Date</Text>
            <TouchableOpacity onPress={onClose} style={calendarStyles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Month Navigation */}
          <View style={calendarStyles.monthHeader}>
            <TouchableOpacity 
              onPress={goToPreviousMonth} 
              style={[
                calendarStyles.navButton,
                !canGoPrevious() && calendarStyles.navButtonDisabled
              ]}
              disabled={!canGoPrevious()}
            >
              <Ionicons 
                name="chevron-back" 
                size={24} 
                color={canGoPrevious() ? "#48BB78" : "#CBD5E0"} 
              />
            </TouchableOpacity>
            <Text style={calendarStyles.monthText}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
            <TouchableOpacity 
              onPress={goToNextMonth} 
              style={[
                calendarStyles.navButton,
                !canGoNext() && calendarStyles.navButtonDisabled
              ]}
              disabled={!canGoNext()}
            >
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={canGoNext() ? "#48BB78" : "#CBD5E0"} 
              />
            </TouchableOpacity>
          </View>

          {/* Info Message */}
          {selectedDateInfo && (
            <View style={[
              calendarStyles.infoMessage,
              selectedDateInfo.reason.type === 'has-appointment' && calendarStyles.infoMessageWarning,
              selectedDateInfo.reason.type === 'blocked' && calendarStyles.infoMessageError
            ]}>
              <Ionicons 
                name={
                  selectedDateInfo.reason.type === 'has-appointment' ? 'calendar' :
                  selectedDateInfo.reason.type === 'blocked' ? 'ban' : 'information-circle'
                } 
                size={18} 
                color={
                  selectedDateInfo.reason.type === 'has-appointment' ? '#D97706' :
                  selectedDateInfo.reason.type === 'blocked' ? '#DC2626' : '#6B7280'
                }
              />
              <Text style={calendarStyles.infoMessageText}>
                {selectedDateInfo.reason.message}
              </Text>
            </View>
          )}

          {/* Day Names */}
          <View style={calendarStyles.dayNamesRow}>
            {dayNames.map((name, index) => (
              <View key={index} style={calendarStyles.dayNameCell}>
                <Text style={[
                  calendarStyles.dayNameText,
                  (index === 0 || index === 6) && calendarStyles.weekendText
                ]}>
                  {name}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <ScrollView style={calendarStyles.calendarScroll}>
            <View style={calendarStyles.calendarGrid}>
              {days.map((date, index) => {
                if (!date) {
                  return <View key={`empty-${index}`} style={calendarStyles.dayCellWrapper} />;
                }

                const disabled = isDateDisabled(date);
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const isToday = isSameDay(date, today);
                const weekend = isWeekend(date);
                const blocked = isDateBlocked(date);
                const hasAppointment = hasStudentAppointment(date);

                let backgroundColor = 'transparent';
                let icon = null;

                if (isSelected) {
                  backgroundColor = '#48BB78';
                } else if (hasAppointment) {
                  backgroundColor = '#FEF3C7'; 
                  icon = 'calendar';
                } else if (blocked) {
                  backgroundColor = '#FEE2E2';  
                  icon = 'ban';
                } else if (weekend) {
                  backgroundColor = '#F3F4F6';
                } else if (isToday) {
                  backgroundColor = '#E6FFFA';
                }

                return (
                  <View key={index} style={calendarStyles.dayCellWrapper}>
                    <TouchableOpacity
                      style={[
                        calendarStyles.dayCell,
                        { backgroundColor },
                        isToday && !isSelected && calendarStyles.todayBorder,
                      ]}
                      onPress={() => handleDatePress(date)}
                      activeOpacity={disabled ? 1 : 0.7}
                    >
                      <Text
                        style={[
                          calendarStyles.dayText,
                          isSelected && calendarStyles.selectedDayText,
                          isToday && !isSelected && calendarStyles.todayDayText,
                          disabled && !isSelected && calendarStyles.disabledDayText,
                        ]}
                      >
                        {date.getDate()}
                      </Text>
                      {icon && !isSelected && (
                        <View style={calendarStyles.dateIndicator}>
                          <Ionicons 
                            name={icon} 
                            size={10} 
                            color={hasAppointment ? '#D97706' : '#EF4444'} 
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </ScrollView>

          {/* Legend - ✅ UPDATED ORDER */}
          <View style={calendarStyles.legend}>
            <View style={calendarStyles.legendItem}>
              <View style={[calendarStyles.legendBox, { backgroundColor: '#FEE2E2' }]} />
              <Text style={calendarStyles.legendText}>Unavailable</Text>
            </View>
            <View style={calendarStyles.legendItem}>
              <View style={[calendarStyles.legendBox, { backgroundColor: '#48BB78' }]} />
              <Text style={calendarStyles.legendText}>Selected</Text>
            </View>
            <View style={calendarStyles.legendItem}>
              <View style={[calendarStyles.legendBox, { backgroundColor: '#F3F4F6' }]} />
              <Text style={calendarStyles.legendText}>Weekend</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const calendarStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A202C',
  },
  closeButton: {
    padding: 4,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F7FAFC',
  },
  navButtonDisabled: {
    opacity: 0.4,
    backgroundColor: '#F3F4F6',
  },
  infoMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  infoMessageWarning: {
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 3,
    borderLeftColor: '#D97706',
  },
  infoMessageError: {
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
  },
  infoMessageText: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  dayNamesRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayNameCell: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayNameText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
    textTransform: 'uppercase',
  },
  weekendText: {
    color: '#E53E3E',
  },
  calendarScroll: {
    maxHeight: 320,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  dayCellWrapper: {
    width: '14.28%',
    padding: 2,
  },
  dayCell: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 15,
    color: '#2D3748',
    fontWeight: '500',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '700',
  },
  todayBorder: {
    borderWidth: 2,
    borderColor: '#48BB78',
  },
  todayDayText: {
    color: '#2D3748',
    fontWeight: '700',
  },
  disabledDayText: {
    color: '#A0AEC0',
  },
  dateIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#4A5568',
  },
});