import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export const AppLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/todos" className="brand">
            Todo App
          </Link>
          <nav aria-label="Main navigation" className="nav">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/todos"
                  className={({ isActive }) =>
                    isActive ? "nav__link nav__link--active" : "nav__link"
                  }
                >
                  All Tasks
                </NavLink>
                <NavLink
                  to="/my-tasks"
                  className={({ isActive }) =>
                    isActive ? "nav__link nav__link--active" : "nav__link"
                  }
                >
                  My Tasks
                </NavLink>
                <NavLink
                  to="/test-error"
                  className={({ isActive }) =>
                    isActive ? "nav__link nav__link--active" : "nav__link"
                  }
                >
                  Test Error Boundary
                </NavLink>
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={logout}
                >
                  Logout
                </button>
                <span className="nav__user" aria-label="Signed in user">
                  {user?.email}
                </span>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? "nav__link nav__link--active" : "nav__link"
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    isActive ? "nav__link nav__link--active" : "nav__link"
                  }
                >
                  Sign up
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main id="main-content" className="page-shell">
        <Outlet />
      </main>
    </>
  );
};
