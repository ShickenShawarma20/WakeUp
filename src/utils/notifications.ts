import NativeAlarm from './nativeAlarm';
import type { Alarm } from '../screens/AlarmListScreen';

export const requestNotificationPermissions = async () => {
  // If we still need to request basic permissions on newer Androids, we could do it here
  // But for the native full screen alarm, the manifest permissions generally handle it.
};

export const syncAlarmsToNotifications = async (alarms: Alarm[]) => {
  try {
    // 1. Clear currently scheduled native alarm
    await NativeAlarm.clear();

    const now = new Date();
    let nextAlarmTime: Date | null = null;
    let nextAlarmLabel = 'WakeUp Luxury';

    // 2. Find the Absolute earliest upcoming alarm
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

          // Advanced by days until the day of week matches
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

    // 3. Schedule the single nearest alarm in the native OS
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
