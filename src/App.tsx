import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlarmListScreen, type Alarm } from './screens/AlarmListScreen';
import { AlarmDetailScreen } from './screens/AlarmDetailScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { RingingScreen } from './screens/RingingScreen';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import { requestNotificationPermissions, syncAlarmsToNotifications } from './utils/notifications';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import NativeAlarm from './utils/nativeAlarm';
type RouteName = 'AlarmList' | 'AlarmDetail' | 'Settings';

function AppContent() {
  const { colors } = useTheme();
  const [isReady, setIsReady] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<RouteName>('AlarmList');
  const [editingAlarmId, setEditingAlarmId] = useState<string | null>(null);
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);
  // Ref to prevent double-trigger before React state update propagates
  const ringingAlarmIdRef = useRef<string | null>(null);

  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem('wakeup-alarms');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: '1',
        time: { hours: 7, minutes: 30, ampm: 'AM' },
        label: 'Morning Routine',
        isEnabled: false,
        repeatDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        soundName: 'Radar'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('wakeup-alarms', JSON.stringify(alarms));
    syncAlarmsToNotifications(alarms);
  }, [alarms]);

  // Request permissions and monitor Native Alarm trigger
  useEffect(() => {
    requestNotificationPermissions();

    const checkForNativeAlarmTrigger = async () => {
      if (Capacitor.getPlatform() === 'web') return; // Prevents "NativeAlarm not implemented" spam
      try {
        const result = await NativeAlarm.checkAlarm();
        if (result.triggered) {
          // Find the nearest scheduled alarm or just the first enabled one as fallback
          setAlarms(prev => {
            const active = prev.find(a => a.isEnabled) || prev[0];
            if (active) {
              setTimeout(() => {
                ringingAlarmIdRef.current = active.id;
                setRingingAlarm(active);
              }, 100);
              // Disable single-fire alarms
              return prev.map(a => a.id === active.id && (!active.repeatDays || active.repeatDays.length === 0) ? { ...a, isEnabled: false } : a);
            }
            return prev;
          });
        }
      } catch (err) {
        console.error("Failed to check native alarm", err);
      }
    };

    // Check immediately on load
    checkForNativeAlarmTrigger();

    // Check every time the app comes to foreground (e.g., from the lockscreen/background)
    const stateListener = CapacitorApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        checkForNativeAlarmTrigger();
      }
    });

    return () => {
      stateListener.then(l => l.remove());
    };
  }, []); // Run on mount

  // Main Alarm Checking Interval
  useEffect(() => {
    if (ringingAlarm) return;

    const interval = setInterval(() => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      hours = hours % 12;
      hours = hours ? hours : 12;

      const activeAlarm = alarms.find(a => 
        a.isEnabled && 
        a.time.hours === hours && 
        a.time.minutes === minutes && 
        a.time.ampm === ampm &&
        now.getSeconds() === 0 // Trigger only exactly on the minute mark
      );

      // Guard with ref to prevent double-trigger during React state update lag
      if (activeAlarm && ringingAlarmIdRef.current !== activeAlarm.id) {
        ringingAlarmIdRef.current = activeAlarm.id;
        setRingingAlarm(activeAlarm);
        // Disable it so it doesn't ring again immediately
        setAlarms(prev => prev.map(a => a.id === activeAlarm.id ? { ...a, isEnabled: false } : a));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms, ringingAlarm]);

  useEffect(() => {
    // Fonts loaded via index.html preconnect — just wait for them to be ready
    document.body.style.margin = '0';
    document.fonts.ready.then(() => setTimeout(() => setIsReady(true), 400));
  }, []);

  const navigate = (routeName: RouteName, params?: { id?: string }) => {
    if (routeName === 'AlarmDetail') setEditingAlarmId(params?.id || null);
    setCurrentRoute(routeName);
  };

  if (!isReady) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100vh',
        background: `linear-gradient(160deg, ${colors.gradientStart} 0%, ${colors.gradientMid} 50%, ${colors.gradientEnd} 100%)`,
        color: colors.textPrimary, gap: '20px',
      }}>
        {/* Ambient glow orb */}
        <div style={{
          position: 'absolute', top: '30%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '300px', height: '300px', borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.ambientGlow.replace('0.15', '0.3')} 0%, transparent 70%)`,
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentPrimaryDim})`,
          boxShadow: `0 0 48px ${colors.ambientGlow}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(16px)',
          position: 'relative', zIndex: 1,
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2 2" />
            <path d="M5 3L2 6" />
            <path d="M22 6l-3-3" />
          </svg>
        </div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '28px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em', position: 'relative', zIndex: 1 }}>WakeUp</h1>
      </div>
    );
  }

  if (ringingAlarm) {
    return (
      <RingingScreen 
        alarmLabel={ringingAlarm.label} 
        onDismiss={() => { ringingAlarmIdRef.current = null; setRingingAlarm(null); }} 
      />
    );
  }

  return (
    <div style={{ backgroundColor: colors.backgroundDeep, minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRoute}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          {currentRoute === 'AlarmList' && (
            <AlarmListScreen
              alarms={alarms}
              nextAlarmText="Next ⏰ 4h 32m"
              onToggleAlarm={(id) => setAlarms(alarms.map(a => a.id === id ? { ...a, isEnabled: !a.isEnabled } : a))}
              onPressAlarm={(id) => navigate('AlarmDetail', { id })}
              onTabPress={(tab) => tab === 'settings' ? navigate('Settings') : tab === 'add' ? navigate('AlarmDetail') : navigate('AlarmList')}
            />
          )}

          {currentRoute === 'AlarmDetail' && (
            <AlarmDetailScreen
              isEditMode={!!editingAlarmId}
              initialData={alarms.find(a => a.id === editingAlarmId) as any}
              onSave={(data) => {
                if (data.id) setAlarms(alarms.map(a => a.id === data.id ? { ...a, ...data } : a));
                else setAlarms([...alarms, { ...data, id: Date.now().toString() } as Alarm]);
                navigate('AlarmList');
              }}
              onDelete={(id) => { setAlarms(alarms.filter(a => a.id !== id)); navigate('AlarmList'); }}
              onBack={() => navigate('AlarmList')}
            />
          )}

          {currentRoute === 'Settings' && (
            <SettingsScreen onTabPress={(tab) => tab === 'alarms' ? navigate('AlarmList') : tab === 'add' ? navigate('AlarmDetail') : navigate('Settings')} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}