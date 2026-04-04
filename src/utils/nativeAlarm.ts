import { registerPlugin } from '@capacitor/core';

export interface NativeAlarmPlugin {
  schedule(options: { time: string; label?: string }): Promise<void>;
  clear(): Promise<void>;
  checkAlarm(): Promise<{ triggered: boolean }>;
  stopAlarm(): Promise<void>;
  requestAlarmPermissions(): Promise<{ exactAlarm: boolean; notifications: string }>;
}

const NativeAlarm = registerPlugin<NativeAlarmPlugin>('NativeAlarm');

export default NativeAlarm;
