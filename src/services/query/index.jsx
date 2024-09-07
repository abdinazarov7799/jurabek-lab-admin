import React from 'react';
import {
    QueryClient,
    QueryClientProvider,
} from 'react-query';
import {ReactQueryDevtools} from "react-query/devtools";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
            staleTime: 3000,
            retryDelay: 1000,
        },
    },
})
const Query = ({children, ...rest}) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

export default Query;
