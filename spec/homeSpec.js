import {Observable} from 'rx'
import Home from '../src/dialogue/pages/home/home-index'
import drivers from './support/fakeDrivers'

const sources = {
  DOM: drivers.fakeDOMDriver,
  HTTP: drivers.fakeHTTPDriver,
  state$: drivers.fakeStateDriver,
  router: drivers.fakeRouterDriver
}

describe('Home', () => {
  it('should submit username and password', (done) => {
    const {fakeDOMDriver} = drivers
    fakeDOMDriver.select('.login').events('click').onNext('boom')
    fakeDOMDriver.select('.username').observable.onNext(Observable.just({ value: "john" }))
    fakeDOMDriver.select('.password').observable.onNext(Observable.just({ value: "doe" }))
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

  it('should retrieve user token from API response', (done) => {
    const {fakeHTTPDriver} = drivers
    fakeHTTPDriver.onNext(Observable.just({ body: { token: "foobarbaz" } }))
    Home(sources).state$.subscribe(s => {
      expect(s).toEqual({
        token: "foobarbaz"
      })
      done()
    })
  })
})
