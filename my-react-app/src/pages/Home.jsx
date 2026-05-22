import React from 'react';
import { SECTIONS } from '../constants/sections';
import Section from '../components/Section';
import './Home.css';

const Home = () => {
  return (
    <main className="home">
      {SECTIONS.map((section, index) => (
        <Section key={section.id} section={section} index={index} />
      ))}
    </main>
  );
};

export default Home;
