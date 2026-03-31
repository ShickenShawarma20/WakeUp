import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlarmListScreen, type Alarm } from './screens/AlarmListScreen';
import { AlarmDetailScreen } from './screens/AlarmDetailScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { RingingScreen } from './screens/RingingScreen';
import { ThemeProvider, useTheme } from './theme/ThemeContext';

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
  }, [alarms]);

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
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@400;500;600;700;800&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    document.body.style.margin = '0';
    document.fonts.ready.then(() => setTimeout(() => setIsReady(true), 500));
  }, []);

  const navigate = (routeName: RouteName, params?: { id?: string }) => {
    if (routeName === 'AlarmDetail') setEditingAlarmId(params?.id || null);
    setCurrentRoute(routeName);
  };

  if (!isReady) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: colors.backgroundDeep, color: colors.textPrimary, gap: '16px' }}>
        <div style={{
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #B040E0, #E040FB)',
          boxShadow: '0 0 40px rgba(224, 64, 251, 0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2 2" />
            <path d="M5 3L2 6" />
            <path d="M22 6l-3-3" />
          </svg>
        </div>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '28px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>WakeUp</h1>
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