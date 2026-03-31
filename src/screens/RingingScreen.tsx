import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

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
  const beepIntervalRef = useRef<number | null>(null);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load Model & Start Sound
  useEffect(() => {
    let isMounted = true;

    cocoSsd.load().then(loadedModel => {
      if (isMounted) {
        setModel(loadedModel);
        setStatus("Point camera at the object and snap.");
      }
    }).catch(err => {
      console.error(err);
      if (isMounted) setStatus("Error loading AI. You can dismiss.");
      setCanDismiss(true);
    });

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

      beepIntervalRef.current = window.setInterval(() => {
        gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 0.2);
      }, 500);

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
    if (beepIntervalRef.current) clearInterval(beepIntervalRef.current);
    if (oscillatorRef.current) {
      try { oscillatorRef.current.stop(); oscillatorRef.current.disconnect(); } catch (e) { }
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const openCamera = async () => {
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    setIsCameraActive(true);
    setStatus("Starting camera...");

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStatus(model ? "Point camera at the object and snap." : "Loading AI Model...");
      }
    } catch (err) {
      setStatus("Camera access denied.");
      setIsCameraActive(false);
      setCanDismiss(true);
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
    stopSound();
    stopCamera();
    onDismiss();
  };

  const pulseAnimation = {
    scale: [1, 1.03, 1],
    opacity: [1, 0.85, 1],
    transition: { duration: 1.5, repeat: Infinity }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: `linear-gradient(180deg, ${colors.backgroundElevated} 0%, ${colors.backgroundDeep} 100%)`,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      overflowY: 'auto',
    }}>
      {/* Purple glow */}
      <div style={{
        position: 'absolute',
        top: '-60px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(224, 64, 251, 0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Time */}
      <motion.h2
        animate={pulseAnimation}
        style={{
          ...typography.alarmTime,
          color: colors.accentMagenta,
          margin: '20px 0 10px',
          textShadow: '0 4px 24px rgba(224, 64, 251, 0.4)',
          zIndex: 1,
        }}
      >
        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </motion.h2>

      <p style={{ ...typography.cardTitle, color: colors.textPrimary, marginBottom: '32px', zIndex: 1 }}>
        {alarmLabel || "Wake Up!"}
      </p>

      {/* Target object card */}
      <div style={{
        background: colors.cardDark,
        border: `2px dashed ${colors.accentMagenta}40`,
        borderRadius: '20px',
        padding: '20px',
        width: '100%',
        maxWidth: '350px',
        textAlign: 'center',
        marginBottom: '20px',
        zIndex: 1,
      }}>
        <p style={{ ...typography.bodyText, color: colors.textSecondary, margin: '0 0 8px' }}>
          To dismiss, take a photo of:
        </p>
        <h3 style={{
          ...typography.heroTitle,
          color: colors.accentMagenta,
          textTransform: 'capitalize' as const,
          margin: 0,
        }}>
          {targetObject}
        </h3>
      </div>

      {!isCameraActive ? (
        <button
          onClick={openCamera}
          style={{
            width: '100%',
            maxWidth: '350px',
            padding: '18px',
            borderRadius: '20px',
            border: 'none',
            background: 'linear-gradient(135deg, #B040E0, #E040FB)',
            color: '#FFF',
            ...typography.cardTitle,
            fontSize: '18px',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(224, 64, 251, 0.35)',
            zIndex: 1,
          }}
        >
          Open Camera
        </button>
      ) : (
        <div style={{
          width: '100%',
          maxWidth: '350px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center',
          zIndex: 1,
        }}>
          <div style={{
            width: '100%',
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: '#000',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            border: `2px solid ${colors.cardDarkBorder}`,
            position: 'relative',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {!cameraReady && (
              <p style={{ color: colors.textMuted, position: 'absolute', fontSize: '14px' }}>
                📷 Initializing camera...
              </p>
            )}
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              onLoadedMetadata={() => setCameraReady(true)}
              style={{
                width: '100%',
                display: 'block',
                opacity: cameraReady ? 1 : 0,
                transition: 'opacity 0.3s',
              }}
            />
          </div>
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          <p style={{
            ...typography.labelText,
            color: canDismiss ? colors.success : colors.textPrimary,
            minHeight: '40px',
            textAlign: 'center',
          }}>
            {status}
          </p>

          {!canDismiss ? (
            <button
              onClick={handleSnapAndVerify}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '20px',
                border: 'none',
                background: 'linear-gradient(135deg, #B040E0, #E040FB)',
                color: '#FFF',
                ...typography.badgeText,
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Snap & Verify
            </button>
          ) : (
            <button
              onClick={handleDismiss}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '20px',
                border: 'none',
                background: colors.success,
                color: '#FFF',
                ...typography.cardTitle,
                fontSize: '18px',
                cursor: 'pointer',
                boxShadow: `0 8px 32px rgba(46, 213, 115, 0.3)`,
              }}
            >
              Dismiss Alarm
            </button>
          )}
        </div>
      )}
    </div>
  );
};