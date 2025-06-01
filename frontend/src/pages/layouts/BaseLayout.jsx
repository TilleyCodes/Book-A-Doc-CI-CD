import { Outlet } from 'react-router';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import '../../styles/header.css';
import '../../styles/footer.css';
import { PageBanner } from '../../components/PageBanner';

export function BaseLayout() {
  return (
    <>
      <Header />
      <main>
        <PageBanner />
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
