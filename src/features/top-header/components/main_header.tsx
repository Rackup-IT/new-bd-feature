'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Dictionary } from '../../../app/[lang]/dictionaries';
import AccountIcon from '../../../assets/custom-icon/account_icon';
import CloseIcon from '../../../assets/custom-icon/close_icon';
import HomeIcon from '../../../assets/custom-icon/home_icon';
import DrawerIcon from '../../../assets/custom-icon/three_line_icon';
import NewsletterLink from '../components/newletter_link';
import SelectEdition from '../components/select_edition';
import IconLink from './icon_link';
import MobileDrawer from './mobile-drawer/mobile_drawer';
import TopbarLink from './top_header_link';

interface MainHeaderProps {
  dict: Dictionary;
}

const MainHeader: React.FC<MainHeaderProps> = (props) => {
  const pathname = usePathname();
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
  const [session, setSession] = useState<{ name: string } | null>(null);
  const transPage = props.dict['Main-Top-Bar'];

  useEffect(() => {
    let mounted = true;

    const fetchSession = async () => {
      try {
        const res = await fetch('/api/v1/user/session', { cache: 'no-store' });
        const data = await res.json();
        if (mounted) setSession(data?.session || null);
      } catch {
        /* ignore */
      }
    };

    fetchSession();

    const bc = new BroadcastChannel('auth');
    bc.onmessage = (ev) => {
      const msg = ev.data;
      if (msg?.type === 'user:login') {
        fetchSession();
      }
      if (msg?.type === 'user:logout') {
        setSession(null);
      }
    };

    return () => {
      mounted = false;
      bc.close();
    };
  }, []);

  const handleDrawerToggle = () => {
    setIsOpenDrawer((prev) => !prev);
  };

  return (
    <header className="relative z-20 border-b border-solid border-gray-200 bg-white">
      <nav className="relative mx-auto flex h-10 justify-between  text-black lg:h-12 tc-container">
        <div className="flex grow h-full items-center gap-2 relative">
          <button className="lg:hidden" onClick={handleDrawerToggle}>
            {isOpenDrawer ? <CloseIcon className="w-6 h-4" /> : <DrawerIcon className="w-6 h-6" />}
          </button>
          <IconLink
            href={`/${pathname.startsWith('/bn') ? 'bn' : 'en'}`}
            className="hidden lg:flex"
          >
            <HomeIcon className="w-5 h-5" />
          </IconLink>
          <SelectEdition dict={props.dict} />
          <h1 className="font-bold flex max-md:grow text-lg lg:hidden">BD-Feature</h1>
          <NewsletterLink dict={props.dict} />
        </div>
        <div className="h-full flex items-center ml-3">
          <div className="h-full hidden md:flex items-center">
            <TopbarLink href="/dashboard" label={transPage['became-an-auhtor']} />
            {!session && (
              <>
                <TopbarLink
                  href={pathname.startsWith('/bn') ? '/bn/sign-up' : '/en/sign-up'}
                  label={transPage['sign-up-as-reader']}
                />
                <TopbarLink
                  href={pathname.startsWith('/bn') ? '/bn/sign-in' : '/en/sign-in'}
                  label={transPage['sign-in']}
                  className="max-lg:hidden"
                />
              </>
            )}

            {session && (
              <div className="ml-3 mr-2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                {session.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {!session && (
            <Link
              href={pathname.startsWith('/bn') ? '/bn/sign-in' : '/en/sign-in'}
              className="ml-3 lg:hidden"
            >
              <AccountIcon className="w-6 h-6" />
            </Link>
          )}
        </div>
      </nav>
      <MobileDrawer isOpen={isOpenDrawer} onClose={handleDrawerToggle} />
    </header>
  );
};

export default MainHeader;
