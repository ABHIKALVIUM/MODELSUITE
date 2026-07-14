/* eslint-disable react-refresh/only-export-components */
import { useState, useCallback, useEffect, useRef } from 'react';

/* ─── Individual Toast Item ─── */
const ToastItem = ({ toast, onRemove }) => {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onRemove(toast.id), toast.duration ?? 3500);
    return () => clearTimeout(timerRef.current);
  }, [toast.id, toast.duration, onRemove]);

  const typeStyles = {
    success: {
      border: 'rgba(16,185,129,0.35)',
      icon: (
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="10" r="8"/>
          <path d="M7 10l2 2 4-4"/>
        </svg>
      ),
      bar: '#10B981',
    },
    error: {
      border: 'rgba(239,68,68,0.35)',
      icon: (
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="10" r="8"/>
          <path d="M10 7v4M10 13h.01"/>
        </svg>
      ),
      bar: '#EF4444',
    },
    info: {
      border: 'rgba(59,130,246,0.35)',
      icon: (
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="10" r="8"/>
          <path d="M10 9v5M10 7h.01"/>
        </svg>
      ),
      bar: '#3B82F6',
    },
  };

  const { border, icon, bar } = typeStyles[toast.type] ?? typeStyles.info;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        background: 'rgba(13,13,13,0.97)',
        border: `1px solid ${border}`,
        borderRadius: '10px',
        padding: '12px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(12px)',
        maxWidth: '340px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        animation: 'toastIn 0.25s cubic-bezier(0.16,1,0.3,1) forwards',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Coloured top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: bar, borderRadius: '10px 10px 0 0' }} />

      {/* Icon */}
      <div style={{ marginTop: '1px', flexShrink: 0 }}>{icon}</div>

      {/* Message */}
      <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', color: '#E5E2E1', flex: 1 }}>
        {toast.message}
      </p>

      {/* Close */}
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.3)', fontSize: '14px', padding: '0 2px',
          marginTop: '1px', flexShrink: 0, lineHeight: 1,
        }}
      >
        ✕
      </button>
    </div>
  );
};

/* ─── Toast Container ─── */
export const ToastContainer = ({ toasts, removeToast }) => {
  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'flex-end',
      }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  );
};

/* ─── Hook ─── */
let _id = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++_id;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error:   (msg, dur) => addToast(msg, 'error',   dur),
    info:    (msg, dur) => addToast(msg, 'info',     dur),
  };

  return { toasts, toast, removeToast };
};
