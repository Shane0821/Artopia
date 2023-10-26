"use client"

import Link from '@node_modules/next/link'
import Image from '@node_modules/next/image'
import { useState, useEffect, useCallback } from 'react'

import { DownOutlined } from '@ant-design/icons';
import { Input, Tooltip, Dropdown } from 'antd';
import type { SearchProps, MenuProps } from 'antd';
const { Search } = Input;

import { ConnectButton } from '@rainbow-me/rainbowkit';

import { getCsrfToken, useSession } from "next-auth/react"
import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi"

const items: MenuProps['items'] = [
  {
    key: '0',
    label: (
      <Link href='/collection/jury' style={{fontSize: '1rem'}}>Jury Collection</Link>
    ),
  },
  {
    key: '1',
    label: (
      <Link href='/collection/factory' style={{fontSize: '1rem'}}>Factory Collection</Link>
    ),
  }
]

function Nav() {
 const islogin = true;
  const { data: session, status } = useSession()
  const { address, isConnected } = useAccount()

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
        
        <Dropdown menu={{ items }} placement="bottomLeft">
          <div className='flex flex-center text-gray-500 hover:text-black'>
            <Link href='/collection' className='nav_link'>
              Collection
            </Link>
            <DownOutlined style={{ fontSize: '0.7rem' }}/>
          </div>
        </Dropdown>
        
        <Link href='/autction' className='nav_link'>Auction</Link>
      </div>

      <Search className='flex-center w-80 gap-1'
              placeholder="input search text" 
              onSearch={onSearch} 
              allowClear
              size="large"
        />

      <div className='flex gap-3 md:gap-5 flex-center'>
        {isConnected && session?.user  ? (
          <div className='flex gap-3 md:gap-5'>
            <Tooltip title="Create Artwork">
              <Link href='/create' className='flex gap-2 flex-center'>
                <Image
                  src='/assets/images/paint-brush.svg'
                  alt='create'
                  width={25}
                  height={25}
                  className='object-contain opacity-75'
                />
              </Link>
            </Tooltip>
            
            <Tooltip title="Shopping Cart">
              <Link href='/' className='flex gap-2 flex-center'>
                <Image
                  src='/assets/images/shopping-cart.svg'
                  alt='cart'
                  width={25}
                  height={25}
                  className='object-contain opacity-75'
                />
              </Link>
            </Tooltip>

            <Tooltip title="Profile">
              <Link href='/profile' className='flex gap-2 flex-center'>
                <Image
                  src='/assets/images/profile-circle.svg'
                  alt='cart'
                  width={25}
                  height={25}
                  className='object-contain opacity-75'
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