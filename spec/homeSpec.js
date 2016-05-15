import { Observable } from 'rx'
import Home from '../src/dialogue/pages/home/home-index'
import fakeSources from './support/fakeSources'

describe('Home', () => {
  var sources

  beforeEach(() => {
    sources = fakeSources()
  })

  it('should not submit empty password', (done) => {
    sources.DOM.select('.login').events('click').onNext('boom')
    sources.DOM.select('.username').observable.onNext(Observable.just({ value: "john" }))
    sources.DOM.select('.password').observable.onNext(Observable.just({ value: "" }))
    Home(sources).HTTP.subscribe((result) => {
      fail('Request has been fired')
    })
    setTimeout(() => {
      // Dummy expectation to make Jasmine happy
      expect(true).toBe(true)
      done()
    }, 1990)
  }, 2000)

  it('should retrieve user token from API response', (done) => {
    sources.HTTP.onNext(Observable.just({ body: { token: "foobarbaz" } }))
    Home(sources).state$.subscribe(s => {
      expect(s).toEqual({
        token: "foobarbaz"
      })
      done()
    })
  })

  it('should submit username and password', (done) => {
    sources.DOM.select('.login').events('click').onNext('boom')
    sources.DOM.select('.username').observable.onNext(Observable.just({ value: "john" }))
    sources.DOM.select('.password').observable.onNext(Observable.just({ value: "doe" }))
    Home(sources).HTTP.subscribe((result) => {
      expect(result).toEqual({
        url: '/auth',
        method: 'POST',
        eager: true,
        type: 'application/x-www-form-urlencoded',
        send: "username=john&password=doe"
      })
      done()
    })
  })
})
