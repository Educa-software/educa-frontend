import React from 'react';
import './Home.scss';
import { Link } from 'react-router-dom';
import { Button } from '../../components';
import homepic from '../../img/home/home.svg'

export const Home = () => {
  return (
    <div className='homeBg'>
      <div className='homecontent' >
        
        <div className='txt-container'>
          <h1>Learn anything</h1>
          <h1>in one place</h1>
          <p>
            Educa is a web application that sum up many kinds
            of knowlege in only one place
          </p>
          <Link to="/login">
            <Button alt text="Get Started"/>
          </Link>
        </div>
        
        <div className='img-container'>
          <img src={homepic} alt=""/>
        </div>

      </div>
    </div>
  );
}