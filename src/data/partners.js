// Partner logos shown in the strip above "Famous places". The admin panel edits this list
// (Home page → Partners); `logo` is an image URL or a file in /public/partners.

const defaultPartners = [
  { id: 'uzairways', name: 'Uzbekistan Airways', logo: '/partners/uzairways.png', url: 'https://www.uzairways.com' },
  { id: 'railway', name: 'Uzbekistan Railways', logo: '/partners/railway.png', url: 'https://railway.uz' },
  { id: 'iticket', name: 'iTicket.uz', logo: '/partners/iticket.png', url: 'https://iticket.uz' },
  { id: 'beeline', name: 'Beeline', logo: '/partners/beeline.png', url: 'https://beeline.uz' },
  { id: 'ucell', name: 'Ucell', logo: '/partners/ucell.png', url: 'https://ucell.uz' },
  { id: 'mobiuz', name: 'Mobiuz', logo: '/partners/mobiuz.png', url: 'https://mobi.uz' },
  { id: 'uzmobile', name: 'Uzmobile', logo: '/partners/uzmobile.png', url: 'https://uztelecom.uz' },
  { id: 'humans', name: 'Humans', logo: '/partners/humans.png', url: 'https://humans.uz' },
]

export let partners = defaultPartners

export function setPartners(next = {}) {
  if (Array.isArray(next.partners)) partners = next.partners
}

export const defaultPartnerData = { partners: defaultPartners }
