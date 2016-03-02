// Test template when wanting to test the DOM
import test from 'tape';
import Rx from 'rx'
import createRenderTarget from './helper/createRenderTarget'
import Cycle from '@cycle/core'
import {makeDOMDriver,h2, h3, h4, div} from '@cycle/dom'

test(`DOM ISOLATED TESTS EXAMPLE #`, (t) => {
  t.plan(6)

  function app(sources) {
    return {
      DOM: Rx.Observable.just(
        h3(`.top-most`, [
          sources.DOM.isolateSink(Rx.Observable.just(
            div(`.foo`, [
              h4(`.bar`, `Wrong`),
            ])
          ), `ISOLATION`),
          h2(`.bar`, `Correct`),
        ])
      ),
    }
  }

  let {sources} = Cycle.run(app, {
    DOM: makeDOMDriver(createRenderTarget()),
  })

  sources
    .DOM
    .select(`.bar`)
    .observable
    .skip(1)
    .take(1)
    .subscribe((elements) => {
      t.equal(Array.isArray(elements), true, `subscription output is an array`)
      t.equal(elements.length, 1, `there should only be one array`)
      const correctElement = elements[0]
      t.notEqual(correctElement, null, `the array isn\`t empty`)
      t.notEqual(typeof correctElement, `undefined`, `the array isn\`t undefined`)
      t.equal(correctElement.tagName, `H2`, `the tag is h2`)
      t.equal(correctElement.textContent, `Correct`)
    })
})
