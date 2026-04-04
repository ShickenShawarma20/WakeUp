import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { AtmosphericBackground } from '../components/AtmosphericBackground';

interface RingingScreenProps {
  alarmLabel: string;
  onDismiss: () => void;
}

const objects = [
  "bottle", "cup", "fork", "spoon", "bowl",
  "banana", "apple", "chair", "potted plant", "tv",
  "laptop", "mouse", "remote", "keyboard", "cell phone",
  "book", "clock", "vase", "scissors", "toothbrush"
];

export const RingingScreen: React.FC<RingingScreenProps> = ({ alarmLabel, onDismiss }) => {
  const { colors } = useTheme();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [targetObject] = useState(() => objects[Math.floor(Math.random() * objects.length)]);

  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [status, setStatus] = useState("Loading AI Model...");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [canDismiss, setCanDismiss] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load Model & Start Sound
  useEffect(() => {
    let isMounted = true;

    setTimeout(() => {
      cocoSsd.load().then(loadedModel => {
        if (isMounted) {
          setModel(loadedModel);
          setStatus("POINT SENSOR AT OBJECT");
        }
      }).catch(err => {
        console.error(err);
        if (isMounted) setStatus("AI MODEL FAILED. YOU CAN DISMISS.");
        setCanDismiss(true);
      });
    }, 1000);

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

      // Pre-schedule 10 minutes of beeping directly onto the audio hardware thread.
      // This guarantees the alarm never stutters even if TFJS completely blocks the main JS thread.
      const now = audioCtx.currentTime;
      for (let i = 0; i < 1200; i++) {
        const time = now + (i * 0.5);
        gainNode.gain.setValueAtTime(1, time);
        gainNode.gain.setValueAtTime(0, time + 0.2);
      }

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillatorRef.current = oscillator;
    } catch (e) {
      console.error("Audio failed", e);
    }

    return () => {
      isMounted = false;
      stopSound();
      stopCamera();
    };
  }, []);

  const stopSound = () => {
    if (oscillatorRef.current) {
      try { oscillatorRef.current.stop(); oscillatorRef.current.disconnect(); } catch (e) { }
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const openCamera = async () => {
    // Resume audio context immediately without awaiting so it doesn't block
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }

    setIsCameraActive(true);
    setStatus("INITIALIZING CAMERA...");

    // Offload media constraints explicitly to minimize delays
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 } }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStatus(model ? "POINT SENSOR AT OBJECT" : "LOADING AI MODEL...");
      }
    } catch (err) {
      try {
        // Fallback for devices that don't support explicit facingMode
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          setStatus(model ? "POINT SENSOR AT OBJECT" : "LOADING AI MODEL...");
        }
      } catch (fallbackErr) {
        setStatus("CAMERA ACCESS ERROR");
        setIsCameraActive(false);
        setCanDismiss(true);
      }
    }
  };

  const handleSnapAndVerify = async () => {
    if (!model || !videoRef.current || !canvasRef.current) return;

    setStatus("Analyzing image with AI...");

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const predictions = await model.detect(canvas);
      const foundTarget = predictions.find(p => p.class.toLowerCase() === targetObject.toLowerCase());

      if (foundTarget) {
        setStatus(`✅ Found ${targetObject}! (${Math.round(foundTarget.score * 100)}%)`);
        setCanDismiss(true);
        stopSound();
      } else {
        const detected = predictions.map(p => p.class).join(', ');
        setStatus(`❌ Not found. Detected: ${detected || 'Nothing'}`);
      }
    } catch (e) {
      setStatus("Error during AI detection.");
      setCanDismiss(true);
    }
  };

  const handleDismiss = () => {
    // 1. Stop web audio/camera
    stopSound();
    stopCamera();
    
    // 2. Stop native alarm service (if on Android)
    const isWeb = !window.hasOwnProperty('Capacitor') || (window as any).Capacitor.getPlatform() === 'web';
    if (!isWeb) {
      import('../utils/nativeAlarm').then(m => m.default.stopAlarm().catch(() => {}));
    }

    // 3. Trigger UI dismissal
    onDismiss();
  };

  const dispHours  = currentTime.getHours() % 12 || 12;
  const dispMinutes = currentTime.getMinutes().toString().padStart(2, '0');
  const dispAmPm   = currentTime.getHours() >= 12 ? 'PM' : 'AM';

  return (
    <AtmosphericBackground style={{
      position: 'fixed', inset: 0,
      zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 'calc(env(safe-area-inset-top) + 32px)',
      paddingLeft: '24px',
      paddingRight: '24px',
      paddingBottom: 'calc(max(env(safe-area-inset-bottom), 24px) + 64px)',
      overflowY: 'auto',
      boxSizing: 'border-box',
    }}>
        <motion.div
          animate={{ scale: [1, 1.02, 1], opacity: [1, 0.88, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '32px 0 16px' }}
        >
          <span style={{ ...typography.displayLg, color: colors.textPrimary, textShadow: `0 0 40px ${colors.ambientGlow}80` }}>
            {dispHours}:{dispMinutes}
          </span>
          <span style={{ ...typography.labelMd, color: colors.accentPrimary }}>
            {dispAmPm}
          </span>
        </motion.div>

        <p style={{ ...typography.headlineMd, color: colors.textPrimary, marginBottom: `${spacing.sp8}px`, textAlign: 'center' }}>
          {alarmLabel || "Wake Up"}
        </p>

        {/* ── Target Object Panel ─────────────────────── */}
        <div style={{
          width: '100%', maxWidth: '340px',
          background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '24px', padding: '24px', textAlign: 'center', marginBottom: '24px',
          boxShadow: `inset 0 1px 0 ${colors.glassHighlight}`,
        }}>
          <p style={{ ...typography.labelMd, color: colors.textMuted, marginBottom: '12px' }}>
            TO DISMISS, CAPTURE:
          </p>
          <h3 style={{ ...typography.headlineMd, color: colors.accentPrimary, margin: 0, textTransform: 'capitalize' }}>
            {targetObject}
          </h3>
        </div>

        {/* ── Camera / Actions ────────────────────────── */}
        <div style={{ width: '100%', maxWidth: '340px', marginTop: '24px' }}>
          {!isCameraActive ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={openCamera}
              style={{
                width: '100%', padding: '20px', borderRadius: '999px', border: 'none', cursor: 'pointer',
                background: `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentPrimaryDim})`,
                boxShadow: `0 0 32px ${colors.ambientGlow}, inset 0 1px 0 rgba(255,255,255,0.2)`,
                color: colors.onPrimary, ...typography.buttonLg,
              }}
            >
              Open Camera
            </motion.button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                width: '100%', borderRadius: '24px', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.5)',
                boxShadow: `inset 0 1px 0 ${colors.glassHighlight}`, position: 'relative', minHeight: '220px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {!cameraReady && (
                  <p style={{ ...typography.labelMd, color: colors.textMuted, position: 'absolute' }}>
                    INITIALIZING SENSOR...
                  </p>
                )}
                <video
                  ref={videoRef} playsInline autoPlay muted onLoadedMetadata={() => setCameraReady(true)}
                  style={{ width: '100%', display: 'block', opacity: cameraReady ? 1 : 0, transition: 'opacity 0.4s ease' }}
                />
              </div>
              <canvas ref={canvasRef} style={{ display: 'none' }} />

              <p style={{ ...typography.labelMd, color: canDismiss ? colors.success : colors.textPrimary, minHeight: '20px', textAlign: 'center' }}>
                {status.toUpperCase()}
              </p>

              {!canDismiss ? (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSnapAndVerify}
                  style={{
                    width: '100%', padding: '16px', borderRadius: '999px', border: 'none', cursor: 'pointer',
                    background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)',
                    boxShadow: `inset 0 1px 0 ${colors.glassHighlight}`, color: colors.textPrimary, ...typography.buttonLg,
                  }}
                >
                  Verify Environment
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDismiss}
                  style={{
                    width: '100%', padding: '20px', borderRadius: '999px', border: 'none', cursor: 'pointer',
                    background: colors.success, color: '#FFF', ...typography.buttonLg,
                    boxShadow: '0 0 24px rgba(46, 213, 115, 0.4)',
                  }}
                >
                  Silence Alarm
                </motion.button>
              )}
            </div>
          )}
        </div>
    </AtmosphericBackground>
  );
};