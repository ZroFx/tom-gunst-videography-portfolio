import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import WorkPage from './pages/WorkPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import ZeroFuxPage from './pages/ZeroFuxPage';
import AboutPage from './pages/AboutPage';
import { Toaster } from './components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function Layout() {
  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const workRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: WorkPage,
});

const zeroFuxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/zerofux',
  component: ZeroFuxPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([workRoute, zeroFuxRoute, aboutRoute, contactRoute, adminRoute]);

const router = createRouter({ routeTree });

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
