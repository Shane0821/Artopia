"use client"

import Link from '@node_modules/next/link'
import Image from '@node_modules/next/image'
import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';

import { Input } from 'antd';
import type { SearchProps } from 'antd';

const { Search } = Input;

function Nav() {
  const loggedIn = true;

  const onSearch: SearchProps['onSearch'] = (value: any, _e: any, info: any) => { console.log(info?.source, value) };

  return (
    <nav className='nav' style={{background: '#fafafa'}}>
      <div className='flex gap-3 md:gap-5 flex-center'>
        <Link href='/' className='flex gap-2 flex-center'>
          <Image
            src='/assets/images/logo.svg'
            alt='Artopia logo'
            width={35}
            height={35}
            className='object-contain'
          />
          <p className='logo_text'>Artopia</p>
        </Link>
        <Link href='/collection' className='nav_link'>Collection</Link>
        <Link href='/autction' className='nav_link'>Auction</Link>
        <Search className='flex-center' placeholder="input search text" onSearch={onSearch} style={{ width: 300 }} allowClear/>
      </div>

      <div className='flex gap-3 md:gap-5 flex-center'>
        {loggedIn ? (
          <div className='flex gap-3 md:gap-5'>
            <Link href='/create' className='nav_link'>
              Create
            </Link>



          </div>
        ) : (
          <></>
        )}
        <ConnectButton>
        </ConnectButton> 
      </div>
    </nav>
  )
}

export default Nav