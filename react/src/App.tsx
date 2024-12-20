import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

import Demo from './learning/Demo';

function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <Demo />
    </QueryClientProvider>
  )
}

export default App
