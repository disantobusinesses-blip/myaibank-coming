import { AppDataProvider } from '@/contexts/app-data-context';

const Layout = ({ children }) => {
  return (
    <AppDataProvider>
      {children}
    </AppDataProvider>
  );
};

export default Layout;