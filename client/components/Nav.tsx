"use client"

import Link from '@node_modules/next/link'
import Image from '@node_modules/next/image'
import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';

import { Input, Tooltip } from 'antd';
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
      </div>

      <Search className='flex-center'
                placeholder="input search text" 
                onSearch={onSearch} 
                style={{ width: 380 }} 
                allowClear
                size="large"
        />

      <div className='flex gap-3 md:gap-5 flex-center'>
        {loggedIn ? (
          <div className='flex gap-3 md:gap-5'>
            <Tooltip title="Create Artwork">
              <Link href='/create' className='flex gap-2 flex-center'>
                <Image
                  src='/assets/images/paint-brush.svg'
                  alt='create'
                  width={30}
                  height={30}
                  className='object-contain'
                />
              </Link>
            </Tooltip>
            
            <Tooltip title="Shopping Cart">
              <Link href='/' className='flex gap-2 flex-center'>
                <Image
                  src='/assets/images/shopping-cart.svg'
                  alt='cart'
                  width={30}
                  height={30}
                  className='object-contain'
                />
              </Link>
            </Tooltip>

            <ConnectButton>
            </ConnectButton> 
          </div>
        ) : (
          <>        
            <ConnectButton>
            </ConnectButton> 
          </>
        )}
      </div>
    </nav>
  )
}

export default Nav