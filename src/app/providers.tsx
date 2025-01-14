'use client'
import React from 'react'
import { SessionProvider } from "next-auth/react"
import {
    QueryClient,
    QueryClientProvider,
} from 'react-query'

const queryClient = new QueryClient()

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                {children}
            </SessionProvider>
        </QueryClientProvider>
    )
}

export default Providers