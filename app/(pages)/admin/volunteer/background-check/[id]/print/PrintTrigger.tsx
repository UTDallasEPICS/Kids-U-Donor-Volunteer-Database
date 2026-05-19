'use client';

import { useEffect } from 'react';

export default function PrintTrigger() {
  useEffect(() => {
    window.print();
  }, []);

  return null;
}
