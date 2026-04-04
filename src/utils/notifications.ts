import NativeAlarm from './nativeAlarm';
import type { Alarm } from '../screens/AlarmListScreen';
import { Capacitor } from '@capacitor/core';

export const requestNotificationPermissions = async () => {
  if (Capacitor.getPlatform() === 'web') return;
  try {
    const result = await NativeAlarm.requestAlarmPermissions();
    console.log('Permissions result:', result);
    return result;
  } catch (err) {
    console.error('Failed to request native alarm permissions:', err);
  }
};

export const syncAlarmsToNotifications = async (alarms: Alarm[]) => {
  if (Capacitor.getPlatform() === 'web') return;
  try {
    await NativeAlarm.clear();

    const now = new Date();
    let nextAlarmTime: Date | null = null;
    let nextAlarmLabel = 'WakeUp Luxury';

    for (const alarm of alarms) {
      if (!alarm.isEnabled) continue;

      let targetHours = alarm.time.hours;
      if (alarm.time.ampm === 'PM' && targetHours < 12) targetHours += 12;
      if (alarm.time.ampm === 'AM' && targetHours === 12) targetHours = 0;

      const dayMap: { [key: string]: number } = {
        'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6
      };

      if (alarm.repeatDays && alarm.repeatDays.length > 0) {
        for (const dayName of alarm.repeatDays) {
          const jsDay = dayMap[dayName];
          if (jsDay === undefined) continue;

          let scheduleDate = new Date(now);
          scheduleDate.setHours(targetHours, alarm.time.minutes, 0, 0);

          while (scheduleDate.getDay() !== jsDay || scheduleDate <= now) {
            scheduleDate.setDate(scheduleDate.getDate() + 1);
          }

          if (!nextAlarmTime || scheduleDate < nextAlarmTime) {
            nextAlarmTime = scheduleDate;
            nextAlarmLabel = alarm.label || 'WakeUp Luxury';
          }
        }
      } else {
        let scheduleDate = new Date(now);
        scheduleDate.setHours(targetHours, alarm.time.minutes, 0, 0);

        if (scheduleDate <= now) {
          scheduleDate.setDate(scheduleDate.getDate() + 1);
        }

        if (!nextAlarmTime || scheduleDate < nextAlarmTime) {
          nextAlarmTime = scheduleDate;
          nextAlarmLabel = alarm.label || 'WakeUp Luxury';
        }
      }
    }

    if (nextAlarmTime) {
      await NativeAlarm.schedule({
        time: nextAlarmTime.getTime().toString(),
        label: nextAlarmLabel
      });
      console.log('Scheduled next native alarm for:', nextAlarmTime.toLocaleString());
    }

  } catch (error) {
    console.error('Error syncing alarms to NativeAlarm plugin:', error);
  }
};
