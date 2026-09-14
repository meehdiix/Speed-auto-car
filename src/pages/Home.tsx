import Hero from '../components/Hero';
import Services from '../components/Services';
import Process from '../components/Process';
import Testimonials from '../components/Testimonials';
import Stats from '../components/Stats';
import LiquidCTA from '../components/LiquidCTA';
import { optimizeImage } from '../utils/imageOptimization';

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Process />
      <Testimonials />
      <Stats />
      <LiquidCTA />
    </>
  );
}
