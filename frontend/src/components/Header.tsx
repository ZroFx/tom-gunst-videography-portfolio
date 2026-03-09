import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { Button } from './ui/button';
import { LogOut, Shield } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { identity, clear, loginStatus } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  const isOnAdminPage = currentPath === '/admin';

  const handleLogout = async () => {
    await clear();
    if (currentPath === '/admin') {
      navigate({ to: '/' });
    }
  };

  const showAdminButton = isAuthenticated && !isAdminLoading && isAdmin === true;
  const showLoginButton = isAuthenticated && (isOnAdminPage || isAdmin);

  return (
    <header className="px-6 md:px-12 lg:px-20 pt-12 pb-8 md:pt-16 md:pb-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-start mb-8 md:mb-10">
          <button
            onClick={() => navigate({ to: '/' })}
            className="group block transition-opacity hover:opacity-70"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase">
              Tom Gunst
            </h1>
          </button>

          <div className="flex items-center gap-3">
            {showAdminButton && (
              <Button
                onClick={() => navigate({ to: '/admin' })}
                variant="outline"
                size="sm"
                className="bg-transparent border-white/20 hover:bg-white/10 text-white"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin Panel
              </Button>
            )}
            {showLoginButton && (
              <Button
                onClick={handleLogout}
                disabled={isLoggingIn}
                variant="outline"
                size="sm"
                className="bg-transparent border-white/20 hover:bg-white/10 text-white"
              >
                {isLoggingIn ? (
                  'Logging out...'
                ) : (
                  <>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <nav className="flex gap-8 md:gap-12">
          <Link
            to="/"
            className={`text-xs md:text-sm tracking-wide transition-all duration-300 relative ${
              currentPath === '/'
                ? 'text-foreground after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            WORK
          </Link>
          <Link
            to="/zerofux"
            className={`text-xs md:text-sm tracking-wide transition-all duration-300 relative ${
              currentPath === '/zerofux'
                ? 'text-foreground after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            ZEROFUX
          </Link>
          <Link
            to="/about"
            className={`text-xs md:text-sm tracking-wide transition-all duration-300 relative ${
              currentPath === '/about'
                ? 'text-foreground after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            ABOUT
          </Link>
          <Link
            to="/contact"
            className={`text-xs md:text-sm tracking-wide transition-all duration-300 relative ${
              currentPath === '/contact'
                ? 'text-foreground after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            CONTACT
          </Link>
        </nav>
      </div>
    </header>
  );
}
