import { useState, useCallback } from 'react';

export function useConfirm() {
  const [state, setState] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const confirm = useCallback((title, message) => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        title,
        message,
        onConfirm: (result) => {
          setState(prev => ({ ...prev, isOpen: false }));
          resolve(result);
        },
      });
    });
  }, []);

  return { confirmState: state, confirm };
}
