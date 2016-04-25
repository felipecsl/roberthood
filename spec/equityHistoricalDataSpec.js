import {Observable} from 'rx'
import moment from 'moment'
import EquityHistoricalData from '../src/models/equity-historical-data'
import {formatMoney, toFixed} from 'accounting'

describe('Equity Historical Data', () => {
  const data = [
    { "close_price":"3293.6000", "adjusted_close_equity":"3293.6000", "begins_at":"2016-04-01T00:00:00Z", "open_market_value":"2990.5400", "open_price":"3283.8600", "adjusted_open_equity":"3283.8600", "close_market_value":"3000.2800", "net_return":"0.0030", "open_equity":"3283.8600", "close_equity":"3293.6000" },
    { "close_price":"3289.3600", "adjusted_close_equity":"3289.3600", "begins_at":"2016-04-04T00:00:00Z", "open_market_value":"3018.6300", "open_price":"3311.9500", "adjusted_open_equity":"3311.9500", "close_market_value":"2996.0400", "net_return":"-0.0068", "open_equity":"3311.9500", "close_equity":"3289.3600" },
    { "close_price":"3278.9300", "adjusted_close_equity":"3278.9300", "begins_at":"2016-04-05T00:00:00Z", "open_market_value":"2961.3700", "open_price":"3254.6900", "adjusted_open_equity":"3254.6900", "close_market_value":"2985.6100", "net_return":"0.0074", "open_equity":"3254.6900", "close_equity":"3278.9300" },
    { "close_price":"3331.6900", "adjusted_close_equity":"3331.6900", "begins_at":"2016-04-06T00:00:00Z", "open_market_value":"2980.8500", "open_price":"3274.1700", "adjusted_open_equity":"3274.1700", "close_market_value":"3038.3700", "net_return":"0.0176", "open_equity":"3274.1700", "close_equity":"3331.6900" },
    { "close_price":"3286.1400", "adjusted_close_equity":"3286.1400", "begins_at":"2016-04-07T00:00:00Z", "open_market_value":"3033.4400", "open_price":"3326.7600", "adjusted_open_equity":"3326.7600", "close_market_value":"2992.8200", "net_return":"-0.0122", "open_equity":"3326.7600", "close_equity":"3286.1400" },
    { "close_price":"3267.4900", "adjusted_close_equity":"3267.4900", "begins_at":"2016-04-08T00:00:00Z", "open_market_value":"3017.0900", "open_price":"3310.4100", "adjusted_open_equity":"3310.4100", "close_market_value":"2974.1700", "net_return":"-0.0130", "open_equity":"3310.4100", "close_equity":"3267.4900" }
  ]
  const dateFormat = "YYYY-MM-DDT00:00:00[Z]"

  describe('1Y', () => {
    it ('percentChange', () => {
      data.forEach((e, i) =>
        e.begins_at = moment().subtract(data.length - 1 - i, 'day').format(dateFormat))
      const historicalData = new EquityHistoricalData({
        portfolio: {
          dailyHistoricals: data,
          last_core_equity: data[data.length - 1].adjusted_close_equity,
        }
      }, '1Y')
      expect(toFixed(historicalData.percentChange(), 2)).toEqual("-0.50")
    })

    it('absChange', () => {
      data.forEach((e, i) =>
        e.begins_at = moment().subtract(data.length - 1 - i, 'day').format(dateFormat))
      const historicalData = new EquityHistoricalData({
        portfolio: {
          dailyHistoricals: data,
          last_core_equity: data[data.length - 1].adjusted_close_equity,
        }
      }, '1Y')
      expect(toFixed(historicalData.absChange(), 2)).toEqual("-16.37")
    })
  })

  describe('1D', () => {
    it ('percentChange', () => {
      data.forEach((e, i) =>
        e.begins_at = moment().subtract(data.length - 1 - i, 'hour').format(dateFormat))
      const historicalData = new EquityHistoricalData({
        portfolio: {
          intradayHistoricals: data,
          adjusted_equity_previous_close: "2000",
          last_core_equity: "2500",
        }
      }, '1D')
      expect(toFixed(historicalData.percentChange(), 2)).toEqual("20.00")
    })

    it('absChange', () => {
      data.forEach((e, i) =>
        e.begins_at = moment().subtract(data.length - 1 - i, 'hour').format(dateFormat))
        const historicalData = new EquityHistoricalData({
          portfolio: {
            intradayHistoricals: data,
            adjusted_equity_previous_close: "2000",
            last_core_equity: "2500",
          }
        }, '1D')
      expect(toFixed(historicalData.absChange(), 2)).toEqual("500.00")
    })

    it('prevClose', () => {
      data.forEach((e, i) =>
        e.begins_at = moment().subtract(data.length - 1 - i, 'hour').format(dateFormat))
      const historicalData = new EquityHistoricalData({
        portfolio: {
          intradayHistoricals: data,
          adjusted_equity_previous_close: "12345",
          last_core_equity: data[data.length - 1].adjusted_close_equity,
        }
      }, '1D')
      expect(historicalData.data("12345").prevClose).toEqual("12345")
    })
  })
})
