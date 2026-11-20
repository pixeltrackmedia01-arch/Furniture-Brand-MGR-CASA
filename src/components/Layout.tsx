import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { EnquiryModal } from './EnquiryModal';
import { Footer } from './Footer';
import { Header } from './Header';
import { Toasts } from './Toasts';

export function Layout() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) return el.scrollIntoView();
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <EnquiryModal />
      <Toasts />
    </>
  );
}
