import React from 'react';
import Hero from "../assets/images/hero-image.jpeg";
import { useState, useEffect } from 'react';


import Mission from '../components/Home/mission';
import HeroDetails from '../components/Home/heroDetails';
import NewConvert from '../components/Home/newConvert';

export default function Home(){
    
    return (
        <>
            <section className="hero-section px-4 py-24 md:py-32 flex items-center">
                <div className="container mx-auto text-center">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <HeroDetails />
                        {/* New Convert Form Section */}
                        <NewConvert />
                    </div>  
                </div>
            </section>
            {/* Mission Statement */}
            <Mission />
            
        </>
    );
}