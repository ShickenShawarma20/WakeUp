package com.wakeupluxury.app;

import android.Manifest;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.provider.Settings;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;

@CapacitorPlugin(
    name = "NativeAlarm",
    permissions = {
        @Permission(
            alias = "notifications",
            strings = { Manifest.permission.POST_NOTIFICATIONS }
        )
    }
)
public class NativeAlarmPlugin extends Plugin {

    private static final String PREFS_NAME = "NativeAlarmPrefs";

    public static void scheduleAlarm(Context context, long timeInMillis, String label) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);

        Intent intent = new Intent(context, AlarmReceiver.class);
        intent.putExtra("alarm_label", label);

        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) flags |= PendingIntent.FLAG_IMMUTABLE;

        PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 0, intent, flags);

        Intent showIntent = new Intent(context, MainActivity.class);
        PendingIntent pendingShowIntent = PendingIntent.getActivity(context, 1, showIntent, flags);

        AlarmManager.AlarmClockInfo info = new AlarmManager.AlarmClockInfo(timeInMillis, pendingShowIntent);
        alarmManager.setAlarmClock(info, pendingIntent);

        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit()
            .putLong("alarm_time", timeInMillis)
            .putString("alarm_label", label)
            .apply();
    }

    @PluginMethod
    public void schedule(PluginCall call) {
        String timeString = call.getString("time");
        String label = call.getString("label", "WakeUp Luxury");

        if (timeString == null) {
            call.reject("Must provide time");
            return;
        }

        try {
            long timeInMillis = Long.parseLong(timeString);
            scheduleAlarm(getContext(), timeInMillis, label);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to schedule alarm", e);
        }
    }

    @PluginMethod
    public void clear(PluginCall call) {
        try {
            Context context = getContext();
            AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);

            Intent intent = new Intent(context, AlarmReceiver.class);
            int flags = PendingIntent.FLAG_UPDATE_CURRENT;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) flags |= PendingIntent.FLAG_IMMUTABLE;

            PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 0, intent, flags);
            alarmManager.cancel(pendingIntent);

            context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE).edit().clear().apply();
            context.stopService(new Intent(context, AlarmService.class));

            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to clear alarm", e);
        }
    }

    @PluginMethod
    public void stopAlarm(PluginCall call) {
        try {
            getContext().stopService(new Intent(getContext(), AlarmService.class));
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to stop alarm", e);
        }
    }

    @PluginMethod
    public void checkAlarm(PluginCall call) {
        Intent intent = getActivity().getIntent();
        boolean isAlarm = false;
        if (intent != null && intent.getBooleanExtra("isAlarmTrigger", false)) {
            isAlarm = true;
            intent.removeExtra("isAlarmTrigger");
            getContext().stopService(new Intent(getContext(), AlarmService.class));
        }
        JSObject ret = new JSObject();
        ret.put("triggered", isAlarm);
        call.resolve(ret);
    }

    @PluginMethod
    public void requestAlarmPermissions(PluginCall call) {
        JSObject ret = new JSObject();
        boolean hasExact = true;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            AlarmManager alarmManager = (AlarmManager) getContext().getSystemService(Context.ALARM_SERVICE);
            hasExact = alarmManager.canScheduleExactAlarms();
            if (!hasExact) {
                Intent intent = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
                getContext().startActivity(intent);
            }
        }
        
        if (getPermissionState("notifications") != PermissionState.GRANTED) {
            requestPermissionForAlias("notifications", call, "permissionsCallback");
        } else {
            ret.put("exactAlarm", hasExact);
            ret.put("notifications", "granted");
            call.resolve(ret);
        }
    }

    @Override
    protected void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        super.handleOnActivityResult(requestCode, resultCode, data);
        // Can add logic here to check exact alarm status after return from settings if needed
    }
}
