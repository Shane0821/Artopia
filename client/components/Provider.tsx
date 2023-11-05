'use client';

import React from 'react'

import '@rainbow-me/rainbowkit/styles.css';

import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';
import { SessionProvider } from 'next-auth/react';
import type { SessionProviderProps } from "next-auth/react"

import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme,
  Chain
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  sepolia,
  polygon,
  optimism,
  arbitrum,
  base
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';


const ariestestnet: Chain = {
  id: 23411,
  name: 'Aries',
  network: 'aries',
  iconUrl: '/assets/icons/aries.svg',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'AXM',
    symbol: 'AXM',
  },
  rpcUrls: {
    public: { http: ['https://rpc1.aries.axiomesh.io'] },
    default: { http: ['https://rpc1.aries.axiomesh.io'] },
  },
  blockExplorers: {
    default: { name: 'aries', url: 'https://scan.aries.axiomesh.io' },
    etherscan: { name: 'aries', url: 'https://scan.aries.axiomesh.io' },
  },
  contracts: {
    // multicall3: {
    //   address: '0xca11bde05977b3631167028862be2a173976ca11',
    //   blockCreated: 11_907_934,
    // },
  },
  testnet: true,
};

const { chains, publicClient } = configureChains(
  [ariestestnet, mainnet, sepolia, polygon, optimism, arbitrum, base],
  [
    // alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Artopia',
  projectId: 'bf1e6486b0e2b71120a7d3dfe9517276',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

const Provider = (props: SessionProviderProps) => (
  <WagmiConfig config={wagmiConfig}>
    <SessionProvider refetchInterval={0} session={props.session}>
      <RainbowKitSiweNextAuthProvider>
        <RainbowKitProvider 
          theme={lightTheme({
            accentColor: '#7b3fe4',
            accentColorForeground: 'white',
            borderRadius: 'medium'
          })}
          chains={chains}
          showRecentTransactions={true}
        >
          {props.children}
        </RainbowKitProvider>
      </RainbowKitSiweNextAuthProvider>
    </SessionProvider>
  </WagmiConfig>
)

export default Provider;