import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaGlobeAsia, FaMapMarkerAlt, FaLandmark, FaChevronDown, FaArrowRight, FaHeadset } from 'react-icons/fa'
import { placeLists, menuLists } from '../data/places'

const icons = { regions: FaGlobeAsia, destinations: FaMapMarkerAlt, landmarks: FaLandmark }

function PopularMenu({ list, open, onOpen, onClose, onToggle }) {
  const { t } = useTranslation()
  const Icon = icons[list]
  const items = placeLists[list].slice(0, 10)

  return (
    <div className={`subnav__item ${open ? 'is-open' : ''}`} onMouseEnter={onOpen} onMouseLeave={onClose}>
      <Link
        to={`/popular/${list}`}
        className="subnav__trigger"
        aria-expanded={open}
        onClick={(e) => {
          // On touch devices the first tap opens the menu instead of navigating.
          if (window.matchMedia('(hover: none)').matches && !open) {
            e.preventDefault()
            onToggle()
          }
        }}
      >
        <Icon /> {t(`subnav.${list}`)} <FaChevronDown className="chev" />
      </Link>

      <div className="mega" role="menu">
        <div className="mega__head">
          <span className="mega__badge">{t('subnav.top10')}</span>
          <strong>{t(`subnav.${list}`)}</strong>
        </div>
        <ol className="mega__list">
          {items.map((p, i) => (
            <li key={p.slug}>
              <Link to={`/place/${list}/${p.slug}`} role="menuitem" onClick={onClose}>
                <span className="mega__rank">{i + 1}</span>
                <span className="mega__text">
                  <strong>{p.name}</strong>
                  <small>{p.country}</small>
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <Link to={`/popular/${list}`} className="mega__all" onClick={onClose}>
          {t('subnav.viewAll')} <FaArrowRight className="flip-rtl" />
        </Link>
      </div>
    </div>
  )
}

export default function SubNav() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const [menu, setMenu] = useState({ list: null, path: pathname })
  const timer = useRef()
  // A menu opened on one page is treated as closed after navigating away.
  const openList = menu.path === pathname ? menu.list : null
  const setOpenList = (update) =>
    setMenu((m) => {
      const current = m.path === pathname ? m.list : null
      return { list: typeof update === 'function' ? update(current) : update, path: pathname }
    })

  useEffect(() => () => clearTimeout(timer.current), [])

  const open = (list) => {
    clearTimeout(timer.current)
    setOpenList(list)
  }
  // A short delay lets the pointer travel from the trigger into the panel.
  const close = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpenList(null), 120)
  }

  return (
    <div className="subnav">
      <div className="container subnav__inner">
        <div className="subnav__menus">
          {menuLists.map((list) => (
            <PopularMenu
              key={list}
              list={list}
              open={openList === list}
              onOpen={() => open(list)}
              onClose={close}
              onToggle={() => setOpenList((cur) => (cur === list ? null : list))}
            />
          ))}
        </div>
        <a className="subnav__support" href="tel:+998916550112">
          <FaHeadset /> {t('subnav.support')}
        </a>
      </div>
    </div>
  )
}
