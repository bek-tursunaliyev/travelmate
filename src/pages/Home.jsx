import HeroCarousel from '../components/HeroCarousel'
import { Services, Favorites, WhyChoose } from '../components/Sections'

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <Services />
      <Favorites />
      <WhyChoose />
    </>
  )
}
