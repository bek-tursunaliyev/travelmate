// eSIM plans for Uzbekistan (/esim). SAMPLE DATA: plans and prices are illustrative — replace
// with the real offers you resell. `logo` may be an image URL; without one the operator name
// is rendered as a wordmark in the brand colour.

const defaultOperators = [
  { id: 'beeline', name: 'Beeline', color: '#ffc800', ink: '#111111', logo: '', network: '4G/5G' },
  { id: 'ucell', name: 'Ucell', color: '#6d2a8c', ink: '#ffffff', logo: '', network: '4G/5G' },
  { id: 'mobiuz', name: 'Mobiuz', color: '#e30613', ink: '#ffffff', logo: '', network: '4G' },
  { id: 'uzmobile', name: 'Uzmobile', color: '#0072bc', ink: '#ffffff', logo: '', network: '4G' },
  { id: 'humans', name: 'Humans', color: '#111111', ink: '#ffffff', logo: '', network: '4G' },
]

const defaultPlans = [
  { id: 'esim-beeline-3', operator: 'beeline', gb: 3, days: 7, price: 4, popular: false },
  { id: 'esim-beeline-10', operator: 'beeline', gb: 10, days: 15, price: 9, popular: true },
  { id: 'esim-beeline-30', operator: 'beeline', gb: 30, days: 30, price: 18, popular: false },
  { id: 'esim-ucell-5', operator: 'ucell', gb: 5, days: 7, price: 5, popular: false },
  { id: 'esim-ucell-15', operator: 'ucell', gb: 15, days: 15, price: 11, popular: true },
  { id: 'esim-ucell-unl', operator: 'ucell', gb: 0, days: 30, price: 25, popular: false },
  { id: 'esim-mobiuz-5', operator: 'mobiuz', gb: 5, days: 10, price: 4, popular: false },
  { id: 'esim-mobiuz-20', operator: 'mobiuz', gb: 20, days: 30, price: 13, popular: false },
  { id: 'esim-uzmobile-10', operator: 'uzmobile', gb: 10, days: 15, price: 7, popular: false },
  { id: 'esim-uzmobile-25', operator: 'uzmobile', gb: 25, days: 30, price: 14, popular: false },
  { id: 'esim-humans-8', operator: 'humans', gb: 8, days: 14, price: 6, popular: false },
  { id: 'esim-humans-40', operator: 'humans', gb: 40, days: 30, price: 19, popular: false },
]

export let esimOperators = defaultOperators
export let esimPlans = defaultPlans

export function setEsim(next = {}) {
  if (Array.isArray(next.esimOperators)) esimOperators = next.esimOperators
  if (Array.isArray(next.esimPlans)) esimPlans = next.esimPlans
}

export const defaultEsim = { esimOperators: defaultOperators, esimPlans: defaultPlans }

export const esimOperatorById = (id) => esimOperators.find((o) => o.id === id)

// Validity filters on the eSIM page.
export const esimDurations = [
  { id: 'week', test: (d) => d <= 10 },
  { id: 'twoWeeks', test: (d) => d > 10 && d <= 20 },
  { id: 'month', test: (d) => d > 20 },
]
