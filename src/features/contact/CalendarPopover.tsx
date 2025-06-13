// CalendarPopover.tsx
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export function CalendarPopover({
  children,
  anchorRect,
  onClose,
}: {
  children: React.ReactNode;
  anchorRect: DOMRect | null;
  onClose: () => void;
}) {
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (!anchorRect) return;

    const calendarWidth = 330; // Adjust if needed
    const calendarHeight = 280;

    let left = anchorRect.left + window.scrollX;
    let top = anchorRect.bottom + window.scrollY + 4;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left + calendarWidth > viewportWidth) {
      left = Math.max(window.scrollX + 8, viewportWidth - calendarWidth - 8);
    }

    if (top + calendarHeight > viewportHeight + window.scrollY) {
      top = anchorRect.top + window.scrollY - calendarHeight - 4;
    }

    setPosition({ top, left });
  }, [anchorRect]);

  if (!anchorRect) return null;

  const style = {
    position: 'fixed' as const,
    top: position.top,
    left: position.left,
    zIndex: 9999,
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('[role="dialog"]')) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return createPortal(
    <div style={style} role="dialog" aria-modal="true" tabIndex={-1}>
      {children}
    </div>,
    document.body,
  );
}
