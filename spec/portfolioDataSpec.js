import {Observable} from 'rx'
import moment from 'moment'
import PortfolioData from '../src/dialogue/pages/portfolio/portfolio-data'

describe('Portfolio Data', () => {
  const data = [{ "adjusted_close_equity":"3293.6000", "begins_at":"2016-04-01T00:00:00Z", "open_market_value":"2990.5400", "adjusted_open_equity":"3283.8600", "close_market_value":"3000.2800", "net_return":"0.0030", "open_equity":"3283.8600", "close_equity":"3293.6000" }, { "adjusted_close_equity":"3289.3600", "begins_at":"2016-04-04T00:00:00Z", "open_market_value":"3018.6300", "adjusted_open_equity":"3311.9500", "close_market_value":"2996.0400", "net_return":"-0.0068", "open_equity":"3311.9500", "close_equity":"3289.3600" }, { "adjusted_close_equity":"3278.9300", "begins_at":"2016-04-05T00:00:00Z", "open_market_value":"2961.3700", "adjusted_open_equity":"3254.6900", "close_market_value":"2985.6100", "net_return":"0.0074", "open_equity":"3254.6900", "close_equity":"3278.9300" }, { "adjusted_close_equity":"3331.6900", "begins_at":"2016-04-06T00:00:00Z", "open_market_value":"2980.8500", "adjusted_open_equity":"3274.1700", "close_market_value":"3038.3700", "net_return":"0.0176", "open_equity":"3274.1700", "close_equity":"3331.6900" }, { "adjusted_close_equity":"3286.1400", "begins_at":"2016-04-07T00:00:00Z", "open_market_value":"3033.4400", "adjusted_open_equity":"3326.7600", "close_market_value":"2992.8200", "net_return":"-0.0122", "open_equity":"3326.7600", "close_equity":"3286.1400" }, { "adjusted_close_equity":"3267.4900", "begins_at":"2016-04-08T00:00:00Z", "open_market_value":"3017.0900", "adjusted_open_equity":"3310.4100", "close_market_value":"2974.1700", "net_return":"-0.0130", "open_equity":"3310.4100", "close_equity":"3267.4900" }]
  const dateFormat = "YYYY-MM-DDT00:00:00[Z]"

  beforeEach(() => {
    data.adjusted_equity_previous_close = "3286.1400"
  })

  const mutateData = (data) => data.map(d => {
    d.open_price = d.adjusted_open_equity
    d.close_price = d.adjusted_close_equity
    return d
  })

  describe('Equity', () => {
    describe('Daily', () => {
      it('data format', (done) => {
        data.forEach((e, i) =>
          e.begins_at = moment().subtract(data.length - 1 - i, 'day').format(dateFormat))
        const model$ = Observable.just(({ dailyHistoricals: data }))
        const dataInterval$ = Observable.just('1Y')
        const data$ = PortfolioData(model$, dataInterval$)
        data$.subscribe(d => {
          expect(d.prevClose).toEqual("3286.1400")
          expect(d.displayPrevClose).toEqual(false)
          expect(d.selector).toEqual('.chart-placeholder')
          expect(d.width).toEqual(480)
          expect(d.height).toEqual(250)
          done()
        })
      })

      it('no filtering', (done) => {
        data.forEach((e, i) =>
          e.begins_at = moment().subtract(data.length - 1 - i, 'day').format(dateFormat))
        const model$ = Observable.just(({ dailyHistoricals: data }))
        const dataInterval$ = Observable.just('1Y')
        const data$ = PortfolioData(model$, dataInterval$)
        data$.subscribe(d => {
          delete data.adjusted_equity_previous_close
          expect(d.data).toEqual(mutateData(data))
          done()
        })
      })

      it('filtering', (done) => {
        data.forEach((e, i) =>
          e.begins_at = moment().subtract(data.length - 1 - i, 'month').format(dateFormat))
        const model$ = Observable.just(({ dailyHistoricals: data }))
        const dataInterval$ = Observable.just('1M')
        const data$ = PortfolioData(model$, dataInterval$)
        data$.subscribe(d => {
          expect(d.data).toEqual(mutateData([data[data.length - 1]]))
          done()
        })
      })
    })

    describe('Intraday', () => {
      it('filtering', (done) => {
        data.forEach((e, i) =>
          e.begins_at = moment().subtract(data.length - 1 - i, 'hour').format(dateFormat))
        const model$ = Observable.just(({ intradayHistoricals: data }))
        const dataInterval$ = Observable.just('1D')
        const data$ = PortfolioData(model$, dataInterval$)
        data$.subscribe(d => {
          delete data.adjusted_equity_previous_close
          expect(d.data).toEqual(mutateData(data))
          done()
        })
      })

      it('data format', (done) => {
        data.forEach((e, i) =>
          e.begins_at = moment().subtract(data.length - 1 - i, 'hour').format(dateFormat))
        const model$ = Observable.just(({ intradayHistoricals: data }))
        const dataInterval$ = Observable.just('1D')
        const data$ = PortfolioData(model$, dataInterval$)
        data$.subscribe(d => {
          expect(d.prevClose).toEqual("3286.1400")
          expect(d.displayPrevClose).toEqual(true)
          expect(d.selector).toEqual('.chart-placeholder')
          expect(d.width).toEqual(480)
          expect(d.height).toEqual(250)
          done()
        })
      })
    })
  })

  describe("Quotes", () => {
    describe("Daily", () => {
      it('data format', (done) => {
        data.forEach((e, i) =>
          e.begins_at = moment().subtract(data.length - 1 - i, 'day').format(dateFormat))
        const model$ = Observable.just(({ positions: [{
          dailyHistoricals: data,
          instrument: {
            symbol: 'AAPL',
            quote: { previous_close: "1234.5678" },
          }
        }] }))
        const dataInterval$ = Observable.just('1Y')
        const data$ = PortfolioData(model$, dataInterval$)
        data$.subscribe(d => {
          expect(d.prevClose).toEqual("1234.5678")
          expect(d.displayPrevClose).toEqual(false)
          expect(d.selector).toEqual('.quote-AAPL-chart-placeholder')
          expect(d.width).toEqual(120)
          expect(d.height).toEqual(40)
          done()
        })
      })

      it('data integrity', (done) => {
        data.forEach((e, i) =>
          e.begins_at = moment().subtract(data.length - 1 - i, 'day').format(dateFormat))
        const model$ = Observable.just(({ positions: [{
          dailyHistoricals: data,
          instrument: {
            symbol: 'AAPL',
            quote: { previous_close: "1234.5678" },
          }
        }] }))
        const dataInterval$ = Observable.just('1Y')
        const data$ = PortfolioData(model$, dataInterval$)
        data$.subscribe(d => {
          delete data.adjusted_equity_previous_close
          expect(d.data).toEqual(data)
          done()
        })
      })

      it('filtering', (done) => {
        data.forEach((e, i) =>
          e.begins_at = moment().subtract(data.length - 1 - i, 'month').format(dateFormat))
        const model$ = Observable.just(({ positions: [{
          dailyHistoricals: data,
          instrument: {
            symbol: 'AAPL',
            quote: { previous_close: "1234.5678" },
          }
        }] }))
        const dataInterval$ = Observable.just('3M')
        const data$ = PortfolioData(model$, dataInterval$)
        data$.subscribe(d => {
          delete data.adjusted_equity_previous_close
          expect(d.data).toEqual([
            data[data.length - 3],
            data[data.length - 2],
            data[data.length - 1]
          ])
          done()
        })
      })
    })

    describe("Intraday", () => {
      it('data format', (done) => {
        data.forEach((e, i) =>
          e.begins_at = moment().subtract(data.length - 1 - i, 'day').format(dateFormat))
        const model$ = Observable.just(({ positions: [{
          intradayHistoricals: data,
          instrument: {
            symbol: 'AAPL',
            quote: { previous_close: "1234.5678" },
          }
        }] }))
        const dataInterval$ = Observable.just('1D')
        const data$ = PortfolioData(model$, dataInterval$)
        data$.subscribe(d => {
          expect(d.prevClose).toEqual("1234.5678")
          expect(d.displayPrevClose).toEqual(true)
          expect(d.selector).toEqual('.quote-AAPL-chart-placeholder')
          expect(d.width).toEqual(120)
          expect(d.height).toEqual(40)
          done()
        })
      })

      it('filtering', (done) => {
        data.forEach((e, i) =>
          e.begins_at = moment().subtract(data.length - 1 - i, 'hour').format(dateFormat))
          const model$ = Observable.just(({ positions: [{
            intradayHistoricals: data,
            instrument: {
              symbol: 'AAPL',
              quote: { previous_close: "1234.5678" },
            }
          }] }))
        const dataInterval$ = Observable.just('1D')
        const data$ = PortfolioData(model$, dataInterval$)
        data$.subscribe(d => {
          delete data.adjusted_equity_previous_close
          expect(d.data).toEqual(data)
          done()
        })
      })
    })
  })
})
