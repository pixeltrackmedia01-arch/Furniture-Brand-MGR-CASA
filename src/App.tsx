import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { StoreProvider } from './lib/store';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const Shop = lazy(() => import('./pages/Shop'));
const Product = lazy(() => import('./pages/Product'));
const Search = lazy(() => import('./pages/Search'));
const EnquiryList = lazy(() => import('./pages/EnquiryList'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Compare = lazy(() => import('./pages/Compare'));
const About = lazy(() => import('./pages/About'));
const Trade = lazy(() => import('./pages/Trade'));
const Contact = lazy(() => import('./pages/Contact'));
const JournalIndex = lazy(() => import('./pages/Journal').then((m) => ({ default: m.JournalIndex })));
const Article = lazy(() => import('./pages/Journal').then((m) => ({ default: m.Article })));
const Info = lazy(() => import('./pages/Info').then((m) => ({ default: m.Info })));
const Faq = lazy(() => import('./pages/Info').then((m) => ({ default: m.Faq })));

const wrap = (el: JSX.Element) => <Suspense fallback={<div style={{ minHeight: '80vh' }} />}>{el}</Suspense>;

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/shop', element: wrap(<Shop />) },
      { path: '/shop/:category', element: wrap(<Shop />) },
      { path: '/collections/:line', element: wrap(<Shop />) },
      { path: '/product/:slug', element: wrap(<Product />) },
      { path: '/search', element: wrap(<Search />) },
      { path: '/enquiry-list', element: wrap(<EnquiryList />) },
      { path: '/wishlist', element: wrap(<Wishlist />) },
      { path: '/compare', element: wrap(<Compare />) },
      { path: '/about', element: wrap(<About />) },
      { path: '/trade', element: wrap(<Trade />) },
      { path: '/contact', element: wrap(<Contact />) },
      { path: '/journal', element: wrap(<JournalIndex />) },
      { path: '/journal/:slug', element: wrap(<Article />) },
      { path: '/info/:slug', element: wrap(<Info />) },
      { path: '/faq', element: wrap(<Faq />) },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return (
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  );
}
