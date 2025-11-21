'use client';
import { AppProvider } from './AppProvider';
import dynamic from 'next/dynamic';

const ClientAppProvider = dynamic(() => Promise.resolve(AppProvider), {
  ssr: false,
});

export default ClientAppProvider;
