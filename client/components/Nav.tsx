"use client"

import Link from '@node_modules/next/link'
import Image from '@node_modules/next/image'
import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';

import { Input } from 'antd';
import type { SearchProps } from 'antd';

const { Search } = Input;

function Nav() {
  const loggedIn = false;

  const onSearch: SearchProps['onSearch'] = (value: any, _e: any, info: any) => { console.log(info?.source, value) };

  return (
    <nav className='flex-between w-full mb-16 pt-3'>
      <div className='flex gap-3 md:gap-5'>
        <Link href='/' className='flex gap-2 flex-center'>
          <Image
            src='/assets/images/logo.svg'
            alt='Artopia logo'
            width={30}
            height={30}
            className='object-contain'
          />
          <p className='logo_text'>Artopia</p>
        </Link>
        <Link href='/collection' className='flex-center'>Collection</Link>
        <Link href='/autction' className='flex-center'>Auction</Link>
        <Link href='/create' className='flex-center'>Create</Link>
      </div>

      <div className='flex'>
        <Search placeholder="input search text" onSearch={onSearch} style={{ width: 350 }} allowClear/>
      </div>

      <div className='flex'>
        {loggedIn ? (
          <div className='flex gap-3 md:gap-5'>
            <Link href='/create-prompt' className='black_btn'>
              Create Artwork
            </Link>

            <button type='button' onClick={(e) => {
                e.preventDefault()
            }} className='outline_btn'>
              Sign Out
            </button>

          </div>
        ) : (
          <>
            <ConnectButton label="Sign in">
            </ConnectButton>      
          </>
        )}
      </div>
    </nav>
  )
}

export default Nav