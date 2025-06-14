'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import Icon from '@/components/icons';
import MobileMenuButton from '@/components/MobileMenu/MobileMenuButton';
import { PortfolioDropdown } from '@/components/PortfolioV2/PortfolioDropdown';
import useStore from '@/stores/store';
import { MODAL_NAMES } from '@/utils/constant';
import { cn } from '@/utils/misc';

import Button from '../WalletButton/Button';

import styles from './styles.module.scss';

export default function Header() {
  const pathname = usePathname();
  const currentModal = useStore((state) => state.currentModal);
  const openModalByName = useStore((state) => state.openModalByName);
  const { connected: solanaWalletConnected } = useWallet();

  const [isPortfolioMenuOpen, setIsPortfolioMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        'sticky top-0 z-30',
        currentModal === MODAL_NAMES.ENDPOINT_SELECTOR && '!z-0',
        currentModal !== null && '!z-0',
        currentModal === MODAL_NAMES.MOBILE_MENU && '!z-40',
      )}
    >
      <div className={`${styles.header}`}>
        <div className={styles.header__container}>
          <div className={styles.header__container__start}>
            <div className={styles.header__container__start__logo}>
              <Link href="/" className="flex items-center py-2 text-xl font-bold text-white">
                <Image alt="emrys logo" src="/emrys-logo1.png" width={60} height={80} />
              </Link>
            </div>
            <div className={styles.header__container__start__nav}>
              <Link
                href={'/utxo'}
                className={`${styles.nav__icon} ${pathname === '/' ? styles.activeLink : ''}`}
              >
                <Icon name="Provide" />
                <span>Mint</span>
              </Link>
              <Link
                href="#"
                className={`relative ${styles.nav__icon} ${pathname === '/utxo/portfolio' || pathname === '/utxo/portfolio/transactions' ? styles.activeLink : ''}`}
                onMouseEnter={() => {
                  setIsPortfolioMenuOpen(true);
                }}
                onMouseLeave={() => {
                  setIsPortfolioMenuOpen(false);
                }}
              >
                <Icon name="Portfolio" />
                <span>Portfolio</span>
                <PortfolioDropdown isOpen={isPortfolioMenuOpen} />
              </Link>
              <Link
                href="/utxo/claim"
                className={`${styles.nav__icon} ${pathname === '/utxo/claim' ? styles.activeLink : ''}`}
              >
                <Icon name="Claim" />
                <span>Claim</span>
              </Link>
              <Link
                href="/utxo/dashboard"
                className={`${styles.nav__icon} ${pathname === '/utxo/dashboard' ? styles.activeLink : ''} `}
              >
                <Icon name="Network" />
                <span>Dashboard</span>
              </Link>
            </div>
          </div>
          <div className={`${styles.header__container__end__desktop}`}>
            <Button
              theme={!solanaWalletConnected ? 'primary' : 'connected'}
              label="Connected"
              icon={!solanaWalletConnected ? <Icon name="Wallet" /> : <Icon name="Tick" />}
              hoveredIcon={<Icon name="ButtonArrow" />}
              iconPosition="left"
              onClick={() => {
                openModalByName(MODAL_NAMES.WALLET_SELECTOR);
              }}
              isLoading={currentModal === MODAL_NAMES.WALLET_SELECTOR}
              solanaWalletRequired
            />
          </div>
          <div className={`${styles.header__container__end__mobile}`}>
            <MobileMenuButton />
            <Button
              theme={!solanaWalletConnected ? 'primary' : 'connected'}
              icon={!solanaWalletConnected ? <Icon name="Wallet" /> : <Icon name="Tick" />}
              hoveredIcon={<Icon name="ButtonArrow" />}
              iconPosition="left"
              onClick={() => {
                openModalByName(MODAL_NAMES.WALLET_SELECTOR);
              }}
              solanaWalletRequired
            />
          </div>
        </div>
      </div>
    </header>
  );
}
