import './Home.scss';
import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';

export default function Home() {
  return (
    <>
      <section className='home-section' id='landing'>
        <div className='home-header__container'>
          <div className='home-header__text'>
            <h1 className='home-header__line1'>Find Shelter In Toronto.</h1>
            <h1 className='home-header__line2'>Today.</h1>
          </div>
        </div>

        <div className='home-button__container'>
          <div class='center-con'>
            <span className='header-actions__text'>Jump to Shelters Map </span>
            <Link to='#shelters'>
              <div class='round'>
                <div id='cta'>
                  <span class='arrow primera next '></span>
                  <span class='arrow segunda next '></span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
