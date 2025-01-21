import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useTheme } from 'next-themes';

interface BookReaderProps {
  url: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  isPdf?: boolean;
}

const BookReader = ({
  url: initialUrl,
  title,
  isOpen,
  onClose,
  isPdf = true
}: BookReaderProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle mounting for theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';
  const url = initialUrl.startsWith('http')
    ? initialUrl
    : `/api/media/${initialUrl}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        style={{
          width: '100vw',
          maxWidth: '100vw',
          height: '100vh',
          maxHeight: '100vh',
          padding: 0,
          margin: 0,
          border: 'none',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: isDark ? '#1a1b1e' : 'white'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 20px',
            borderBottom: `1px solid ${isDark ? '#2d2e32' : '#e5e7eb'}`,
            backgroundColor: isDark ? '#1a1b1e' : 'white',
            position: 'relative'
          }}
        >
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: 500,
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: isDark ? '#e5e7eb' : '#1f2937',
              flex: 1,
              paddingRight: '48px'
            }}
          >
            {title}
          </h2>

          {/* Improved Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: isDark ? '#e5e7eb' : '#4b5563'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark
                ? '#2d2e32'
                : '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
          
          </button>
        </div>

        {/* Content Area */}
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            backgroundColor: isDark ? '#141517' : '#f3f4f6',
            position: 'relative',
            display: 'flex'
          }}
        >
          {isPdf ? (
            <iframe
              src={url}
              title={title}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block',
                backgroundColor: isDark ? '#141517' : 'white'
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '16px'
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '4px'
                }}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookReader;
