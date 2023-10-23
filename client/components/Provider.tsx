'use client';

import React from 'react'
import type { SessionProviderProps } from "next-auth/react"
import { SessionProvider } from "next-auth/react";


const Provider = (props: SessionProviderProps) => (
  <SessionProvider session={props.session}>
    {props.children}
  </SessionProvider>
)

export default Provider;