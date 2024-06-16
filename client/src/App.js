import './App.scss';
// react-router
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// google analytics
import { initGA } from './utils/analytics';
// contexts
import ApiKeyProvider from './contexts/ApiKeyContext';
// hooks
import { useGeolocation } from './hooks/useGeolocation';
// components
import Header from '../src/components/Header/Header';
import Home from '../src/components/Home/Home';
import Parallax1 from './components/Parallax1/Parallax1';
import AboutUs from './components/AboutUs/AboutUs';
import Parallax3 from './components/Parallax3/Parallax3';
import Parallax2 from './components/Parallax2/Parallax2';
import SheltersCard from './components/SheltersCard/SheltersCard';
import Resources from './components/Resources/Resources';
import Footer from './components/Footer/Footer';
import CookiePolicy from './components/Legal/CookiePolicy/CookiePolicy';
import TermsOfUse from './components/Legal/TermsOfUse/TermsOfUse';
import MealsCard from './components/MealsCard/MealsCard';
import MealsMap from './components/MealsMap/MealsMap';
import ComingSoon from './components/ComingSoon/ComingSoon';

export default function App() {
  const { locationInfo, locationError } = useGeolocation();
  console.log({ locationError, locationInfo });
  initGA(); // Initialize Google Analytics

  return (
    <ApiKeyProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route
            path='/'
            element={
              <>
                <Home />
                <Parallax1 />
                <SheltersCard />
                <MealsCard />
                <Parallax2 />
                <Resources />
                <Parallax3 />
                <AboutUs />
              </>
            }
          />
          <Route path='/cookie-policy' element={<CookiePolicy />} />
          <Route path='/terms-of-use' element={<TermsOfUse />} />
          <Route path='/drop-in-map' element={<MealsMap />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ApiKeyProvider>
  );
}
