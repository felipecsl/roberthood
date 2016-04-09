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
const fakeHTTPDriver = new ReplaySubject()
const fakeStateDriver = new ReplaySubject()
const fakeRouterDriver = {
  createHref(path) {
    return path
  }
}

export default {fakeDOMDriver, fakeHTTPDriver, fakeStateDriver, fakeRouterDriver}
