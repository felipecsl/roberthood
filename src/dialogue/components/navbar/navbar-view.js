import {div, ul, li, a, nav, h1, h2} from '@cycle/dom'

function view(sources, path$) {
  const {router: {createHref}} = sources
  const homeHref = createHref(`/`)
  const portfolioHref = createHref(`/portfolio`)

  return path$.map(() => {
    return div([
      nav(`.nav`, [
        ul(`.nav-list`, [
          li(`.nav-item .link`, [
            a(`.pure-button`, {href: homeHref}, [`Home`]),
          ]),
          li(`.nav-item .link`, [
            a(`.pure-button`, {href: portfolioHref}, [`Portfolio`]),
          ])
        ]),
      ])])
  })
}

export default view
