import Navbar from './components/nav';
import Footer from './components/footer';

export default function WebsiteLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
