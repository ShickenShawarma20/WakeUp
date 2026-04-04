package com.wakeupluxury.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

public class AlarmReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        String label = intent.getStringExtra("alarm_label");

        // Start the foreground AlarmService — this is what rings the alarm
        Intent serviceIntent = new Intent(context, AlarmService.class);
        if (label != null) serviceIntent.putExtra(AlarmService.EXTRA_LABEL, label);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(serviceIntent);
        } else {
            context.startService(serviceIntent);
        }
    }
}
