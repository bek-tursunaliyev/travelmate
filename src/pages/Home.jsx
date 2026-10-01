import HeroCarousel from '../components/HeroCarousel'
import { Services, Partners, FamousPlaces, Faq } from '../components/Sections'
import { ToursCarousel } from './Tours'

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <Services />
      <ToursCarousel />
      <Partners />
      <FamousPlaces />
      <Faq />
    </>
  )
}
