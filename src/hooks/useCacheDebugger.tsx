import { QueryClient } from '@tanstack/react-query';


// const unsub1 = debugAllQueries(queryClient);
// const unsub2 = debugQueryKey(queryClient, 'friendListAndUpcoming');
// const unsub3 = debugQueryKeyStructure(queryClient, 'friendListAndUpcoming');
// const unsub4 = debugMutations(queryClient);


function logStructure(obj: any, depth = 3): any {
  if (depth === 0 || obj === null || obj === undefined) return typeof obj;
  if (Array.isArray(obj))
    return obj.length > 0 ? [logStructure(obj[0], depth - 1), `...${obj.length} items`] : [];
  if (typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, logStructure(v, depth - 1)])
    );
  }
  return typeof obj;
}

export function debugAllQueries(queryClient: QueryClient) {
  return queryClient.getQueryCache().subscribe((event) => {
    console.log('[QueryCache]', event.type, event.query.queryKey);
  });
}

export function debugQueryKey(queryClient: QueryClient, queryKey: string) {
  return queryClient.getQueryCache().subscribe((event) => {
    if (event.query.queryKey[0] === queryKey) {
      console.log(
        `[${queryKey}]`,
        event.type,
        event.type === 'updated' ? JSON.stringify(event.query.state.data?.id) : ''
      );
    }
  });
}

export function debugQueryKeyStructure(queryClient: QueryClient, queryKey: string) {
  return queryClient.getQueryCache().subscribe((event) => {
    if (event.query.queryKey[0] === queryKey) {
      if (event.type === 'updated' && event.query.state.data) {
        console.log(
          `[${queryKey}] structure:`,
          JSON.stringify(logStructure(event.query.state.data), null, 2)
        );
      }
    }
  });
}

export function debugMutations(queryClient: QueryClient) {
  return queryClient.getMutationCache().subscribe((event) => {
    const running = queryClient
      .getMutationCache()
      .getAll()
      .filter((m) => m.state.status === 'pending').length;
    console.log(
      '[MutationCache]',
      event.type,
      '| key:',
      JSON.stringify(event.mutation?.options?.mutationKey),
      '| fn:',
      event.mutation?.options?.mutationFn?.name,
      '| running:',
      running
    );
  });
}

