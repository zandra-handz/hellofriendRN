import { useState, useRef } from 'react';
import { groqCall } from '../calls/api';
import { showModalMessage, dismissModalMessage } from '../utils/ShowModalMessage';

const useGroqBeta = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const autoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeModal = () => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    dismissModalMessage();
    setIsModalOpen(false);
  };

  const openModal = (title: string, body: string) => {
    setIsModalOpen(true);
    showModalMessage({
      title,
      body,
      onConfirm: closeModal,
    });
    autoCloseTimerRef.current = setTimeout(() => closeModal(), 7000);
  };

  const askGroq = async (role: string, prompt: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await groqCall({ role, prompt });
      const reply = data?.response || '';

      if (reply) {
        openModal('Gecko beta says', reply);
      }

      return reply;
    } catch (e: any) {
      setError(e?.message || 'Something went wrong');
      openModal('Error', e?.message || 'Something went wrong');
      return '';
    } finally {
      setLoading(false);
    }
  };

  return { askGroq, loading, error, isModalOpen };
};

export default useGroqBeta;