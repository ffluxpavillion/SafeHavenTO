import './Parallax.scss';
import ParallaxImage from '../../assets/images/SafeHavenTO_ttc-queen-station.jpg';

export default function Parallax() {
  return (
    <>
      <div className="parallax" style={{ backgroundImage: `url(${ParallaxImage})` }}></div>
    </>
  );
}
