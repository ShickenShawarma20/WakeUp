package com.wakeupluxury.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (!Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction()) &&
            !"android.intent.action.QUICKBOOT_POWERON".equals(intent.getAction())) {
            return;
        }

        // Read the saved alarm time from SharedPreferences (saved by NativeAlarmPlugin)
        SharedPreferences prefs = context.getSharedPreferences("NativeAlarmPrefs", Context.MODE_PRIVATE);
        long alarmTime = prefs.getLong("alarm_time", -1);
        String alarmLabel = prefs.getString("alarm_label", "WakeUp Luxury");

        if (alarmTime > System.currentTimeMillis()) {
            NativeAlarmPlugin.scheduleAlarm(context, alarmTime, alarmLabel);
        }
    }
}
