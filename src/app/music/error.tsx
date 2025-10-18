'use client';

import { useEffect } from 'react';

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>
      <h2>Ошибка: {error.message}</h2>
      <button
        onClick={reset}
        style={{
          background: '#580ea2',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Попробовать снова
      </button>
    </div>
  );
}