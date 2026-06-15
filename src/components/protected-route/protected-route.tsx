import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useAppSelector } from '@store/index';
import { Navigate, useLocation } from 'react-router-dom';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  component: React.JSX.Element;
};

const ProtectedRoute = ({
  onlyUnAuth = false,
  component,
}: TProtectedRouteProps): React.JSX.Element => {
  const isAuthChecked = useAppSelector((s) => s.auth.isAuthChecked);
  const user = useAppSelector((s) => s.auth.user);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = (location.state as { from?: string } | null)?.from ?? '/';
    return <Navigate to={from} />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return component;
};

export const OnlyAuth = ProtectedRoute;

export const OnlyUnAuth = ({
  component,
}: {
  component: React.JSX.Element;
}): React.JSX.Element => <ProtectedRoute onlyUnAuth component={component} />;
