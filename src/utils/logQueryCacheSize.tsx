export function logQueryCacheSize(queryClient) {
 
  const queries = queryClient.getQueryCache().getAll();

  let totalBytes = 0;

  queries.forEach((query) => {
    try {
      const dataStr = JSON.stringify(query.state.data);
      totalBytes += dataStr.length; // roughly 1 char = 1 byte
    } catch (err) {
      console.warn('Failed to stringify query data for key:', query.queryKey);
    }
  });

  console.log(`React Query Cache: ${queries.length} queries`);
  console.log(`Approximate memory usage: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
}

 