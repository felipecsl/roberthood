import Home from '../src/dialogue/pages/home/home-index'
import {Observable, ReplaySubject, TestScheduler} from 'rx'

var FakeElement = function(selector) {
  this.selector = selector
  this.evts = new ReplaySubject()
  this.observable = new ReplaySubject()
}
FakeElement.prototype.events = function(eventName) {
  return this.evts
}
const fakeElements = []
const fakeDOMDriver = {
  select(selector) {
    let existing = fakeElements.find(e => e.selector === selector)
    if (existing === undefined) {
      existing = new FakeElement(selector)
      fakeElements.push(existing)
    }
    return existing
  }
}
const fakeHTTPDriver = Observable.just(() => new ReplaySubject())
const fakeStateDriver = new ReplaySubject()
const fakeRouterDriver = {
  createHref(path) {
    return path
  }
}

const sources = {
  DOM: fakeDOMDriver,
  HTTP: fakeHTTPDriver,
  state$: fakeStateDriver,
  router: fakeRouterDriver
}

describe('app', () => {
  it('should work', (done) => {
    fakeDOMDriver.select('.login').events('click').onNext('boom')
    fakeDOMDriver.select('.username').observable.onNext(Observable.just({ value: "john" }))
    fakeDOMDriver.select('.password').observable.onNext(Observable.just({ value: "doe" }))
    let sinks = Home(sources)
    let result
    sinks.HTTP.subscribe((result) => {
      expect(result).toEqual(({
        url: '/auth',
        method: 'POST',
        eager: true,
        type: 'application/x-www-form-urlencoded',
        send: "username=john&password=doe"
      }))
      done()
    })
  })
})
