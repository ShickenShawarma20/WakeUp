package com.wakeupluxury.app;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "NativeAlarm")
public class NativeAlarmPlugin extends Plugin {

    @PluginMethod
    public void schedule(PluginCall call) {
        String timeString = call.getString("time");
        if (timeString == null) {
            call.reject("Must provide time");
            return;
        }

        try {
            long timeInMillis = Long.parseLong(timeString);
            
            Context context = getContext();
            AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            
            Intent intent = new Intent(context, AlarmReceiver.class);
            
            int flags = PendingIntent.FLAG_UPDATE_CURRENT;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                flags |= PendingIntent.FLAG_IMMUTABLE;
            }
            
            PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 0, intent, flags);
            
            Intent showIntent = new Intent(context, MainActivity.class);
            PendingIntent pendingShowIntent = PendingIntent.getActivity(context, 1, showIntent, flags);
            
            AlarmManager.AlarmClockInfo info = new AlarmManager.AlarmClockInfo(timeInMillis, pendingShowIntent);
            alarmManager.setAlarmClock(info, pendingIntent);

            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to schedule", e);
        }
    }

    @PluginMethod
    public void clear(PluginCall call) {
        Context context = getContext();
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(context, AlarmReceiver.class);
        
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }
        
        PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 0, intent, flags);
        alarmManager.cancel(pendingIntent);
        call.resolve();
    }

    @PluginMethod
    public void checkAlarm(PluginCall call) {
        Intent intent = getActivity().getIntent();
        boolean isAlarm = false;
        if (intent != null && intent.getBooleanExtra("isAlarmTrigger", false)) {
            isAlarm = true;
            intent.removeExtra("isAlarmTrigger");
        }
        JSObject ret = new JSObject();
        ret.put("triggered", isAlarm);
        call.resolve(ret);
    }
}
