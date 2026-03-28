// import { useRef, useState, useCallback } from 'react';
// import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
// import { groqCall } from '../calls/api';
// import {
//   showModalMessage,
//   dismissModalMessage,
// } from '../utils/ShowModalMessage';

// export type GroqMessage = {
//   role: 'user' | 'assistant' | 'system';
//   content: string;
//   timestamp: number;
// };

// const MAX_HISTORY = 40;

// type Props = {
//   userId: number | null;
//   friendId: number | null;
//   pauseTime: number;
// };

// const groqHistoryQueryOptions = (userId: number | null, friendId: number | null) => ({
//   queryKey: ['groqConversationHistory', userId, friendId],
//   queryFn: (): GroqMessage[] => [],
//   staleTime: Infinity,
//   gcTime: 1000 * 60 * 60 * 24 * 7,
//   enabled: !!(userId && friendId),
// });

// const useGroqBeta = ({ userId, friendId, pauseTime=7000 }: Props) => {
//   const qc = useQueryClient();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const autoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const queryOptions = groqHistoryQueryOptions(userId, friendId);

//   const { data: history = [] } = useQuery<GroqMessage[]>(queryOptions);
// const onModalCloseRef = useRef<(() => void) | null>(null);

// const closeModal = useCallback(() => {
//   if (autoCloseTimerRef.current) {
//     clearTimeout(autoCloseTimerRef.current);
//     autoCloseTimerRef.current = null;
//   }
//   dismissModalMessage();
//   setIsModalOpen(false);
//   onModalCloseRef.current?.();
//   onModalCloseRef.current = null;
// }, []);

//   const openModal = useCallback(
//     (title: string, body: string) => {
//       setIsModalOpen(true);
//       showModalMessage({ title, body, onConfirm: closeModal });
//       autoCloseTimerRef.current = setTimeout(closeModal, pauseTime);
//     },
//     [closeModal],
//   );

//   const appendMessages = useCallback(
//     (msgs: GroqMessage[]) => {
//       qc.setQueryData<GroqMessage[]>(queryOptions.queryKey, (prev = []) =>
//         [...prev, ...msgs].slice(-MAX_HISTORY),
//       );
//       const updated = qc.getQueryData<GroqMessage[]>(queryOptions.queryKey);
//       // console.log('[Groq cache updated]', JSON.stringify(updated, null, 2));
//     },
//     [qc, queryOptions.queryKey],
//   );

//   const mutation = useMutation({
//     mutationFn: async ({
//       role,
//       prompt,
//       silent,
//     }: {
//       role: string;
//       prompt: string;
//       silent?: boolean;
//     }) => {
//       if (!userId || !friendId) throw new Error('Missing userId or friendId');

//       const recentHistory = (
//         qc.getQueryData<GroqMessage[]>(queryOptions.queryKey) ?? []
//       ).slice(-20);

//       const data = await groqCall({
//         role,
//         prompt,
//         conversationHistory: recentHistory,
//       });

//       return data?.response || '';
//     },
// onMutate: ({ prompt }) => {
//   appendMessages([
//     { role: 'user', content: prompt, timestamp: Date.now() },
//   ]);
// },
//     onSuccess: (reply, variables) => {
//       if (reply) {
//         appendMessages([
//           { role: 'assistant', content: reply, timestamp: Date.now() },
//         ]);
//         if (!variables.silent) {
//           openModal('Gecko beta says', reply);
//         }
//       }
//     },
//     onError: (e: any, variables) => {
//       if (!variables.silent) {
//         openModal('Error', e?.message || 'Something went wrong');
//       }
//     },
//   });

//   const askGroq = useCallback(
//     (role: string, prompt: string, { silent = false } = {}) =>
//       mutation.mutateAsync({ role, prompt, silent }),
//     [mutation],
//   );

//   const clearHistory = useCallback(() => {
//     qc.setQueryData(queryOptions.queryKey, []);
//   }, [qc, queryOptions.queryKey]);

//   return {
//     askGroq,
//     loading: mutation.isPending,
//     error: mutation.error?.message ?? null,
//     isModalOpen,
//     history,
//     clearHistory,
//     onModalCloseRef,
//   };
// };

// export default useGroqBeta;




import { useRef, useState, useCallback } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { groqCall } from '../calls/api';
import {
  showModalMessage,
  dismissModalMessage,
} from '../utils/ShowModalMessage';

export type GroqMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
};

const MAX_HISTORY = 40;

type Props = {
  userId: number | null;
  friendId: number | null;
  pauseTime: number;
};

const groqHistoryQueryOptions = (userId: number | null, friendId: number | null) => ({
  queryKey: ['groqConversationHistory', userId, friendId],
  queryFn: (): GroqMessage[] => [],
  staleTime: Infinity,
  gcTime: 1000 * 60 * 60 * 24 * 7,
  enabled: !!(userId && friendId),
});

const useGroqBeta = ({ userId, friendId, pauseTime=7000 }: Props) => {
  const qc = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const autoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const queryOptions = groqHistoryQueryOptions(userId, friendId);

  const { data: history = [] } = useQuery<GroqMessage[]>(queryOptions);
  const onModalCloseRef = useRef<(() => void) | null>(null);

  const closeModal = useCallback(() => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    dismissModalMessage();
    setIsModalOpen(false);
    onModalCloseRef.current?.();
    onModalCloseRef.current = null;
  }, []);

  const openModal = useCallback(
    (title: string, body: string) => {
      setIsModalOpen(true);
      showModalMessage({ title, body, onConfirm: closeModal });
      autoCloseTimerRef.current = setTimeout(closeModal, pauseTime);
    },
    [closeModal],
  );

  const appendMessages = useCallback(
    (msgs: GroqMessage[]) => {
      qc.setQueryData<GroqMessage[]>(queryOptions.queryKey, (prev = []) =>
        [...prev, ...msgs].slice(-MAX_HISTORY),
      );
      const updated = qc.getQueryData<GroqMessage[]>(queryOptions.queryKey);
      // console.log('[Groq cache updated]', JSON.stringify(updated, null, 2));
    },
    [qc, queryOptions.queryKey],
  );

  const mutation = useMutation({
    mutationFn: async ({
      role,
      prompt,
      noHistory,
    }: {
      role: string;
      prompt: string;
      silent?: boolean;
      noHistory?: boolean;
    }) => {
      if (!userId || !friendId) throw new Error('Missing userId or friendId');

      const recentHistory = noHistory
        ? []
        : (qc.getQueryData<GroqMessage[]>(queryOptions.queryKey) ?? []).slice(-20);

      const data = await groqCall({
        role,
        prompt,
        conversationHistory: recentHistory,
      });

      return data?.response || '';
    },
    onMutate: ({ prompt, noHistory }) => {
      if (!noHistory) {
        appendMessages([
          { role: 'user', content: prompt, timestamp: Date.now() },
        ]);
      }
    },
    onSuccess: (reply, variables) => {
      if (reply) {
        if (!variables.noHistory) {
          appendMessages([
            { role: 'assistant', content: reply, timestamp: Date.now() },
          ]);
        }
        if (!variables.silent) {
          openModal('Gecko beta says', reply);
        }
      }
    },
    onError: (e: any, variables) => {
      if (!variables.silent) {
        openModal('Error', e?.message || 'Something went wrong');
      }
    },
  });

  const askGroq = useCallback(
    (role: string, prompt: string, { silent = false, noHistory = false } = {}) =>
      mutation.mutateAsync({ role, prompt, silent, noHistory }),
    [mutation],
  );

  const clearHistory = useCallback(() => {
    qc.setQueryData(queryOptions.queryKey, []);
  }, [qc, queryOptions.queryKey]);

  return {
    askGroq,
    loading: mutation.isPending,
    error: mutation.error?.message ?? null,
    isModalOpen,
    history,
    clearHistory,
    onModalCloseRef,
  };
};

export default useGroqBeta;