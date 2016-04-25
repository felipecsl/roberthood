import {Observable} from 'rx'
import {parseData} from '../src/historical-data-driver'

describe('Data Driver', () => {
  it('line data format', () => {
    const data = [
      { "close_price":"3293.6000", "adjusted_close_equity":"3293.6000", "begins_at":"2016-04-01T00:00:00Z", "open_market_value":"2990.5400", "open_price":"3283.8600", "adjusted_open_equity":"3283.8600", "close_market_value":"3000.2800", "net_return":"0.0030", "open_equity":"3283.8600", "close_equity":"3293.6000" },
      { "close_price":"3289.3600", "adjusted_close_equity":"3289.3600", "begins_at":"2016-04-04T00:00:00Z", "open_market_value":"3018.6300", "open_price":"3311.9500", "adjusted_open_equity":"3311.9500", "close_market_value":"2996.0400", "net_return":"-0.0068", "open_equity":"3311.9500", "close_equity":"3289.3600" },
      { "close_price":"3278.9300", "adjusted_close_equity":"3278.9300", "begins_at":"2016-04-05T00:00:00Z", "open_market_value":"2961.3700", "open_price":"3254.6900", "adjusted_open_equity":"3254.6900", "close_market_value":"2985.6100", "net_return":"0.0074", "open_equity":"3254.6900", "close_equity":"3278.9300" },
      { "close_price":"3331.6900", "adjusted_close_equity":"3331.6900", "begins_at":"2016-04-06T00:00:00Z", "open_market_value":"2980.8500", "open_price":"3274.1700", "adjusted_open_equity":"3274.1700", "close_market_value":"3038.3700", "net_return":"0.0176", "open_equity":"3274.1700", "close_equity":"3331.6900" },
      { "close_price":"3286.1400", "adjusted_close_equity":"3286.1400", "begins_at":"2016-04-07T00:00:00Z", "open_market_value":"3033.4400", "open_price":"3326.7600", "adjusted_open_equity":"3326.7600", "close_market_value":"2992.8200", "net_return":"-0.0122", "open_equity":"3326.7600", "close_equity":"3286.1400" },
      { "close_price":"3267.4900", "adjusted_close_equity":"3267.4900", "begins_at":"2016-04-08T00:00:00Z", "open_market_value":"3017.0900", "open_price":"3310.4100", "adjusted_open_equity":"3310.4100", "close_market_value":"2974.1700", "net_return":"-0.0130", "open_equity":"3310.4100", "close_equity":"3267.4900" }
    ],
    testData = {
      data: data,
      prevClose: "1234.56",
      displayPrevClose: true,
      selector: '.chart-placeholder',
      width: 480,
      height: 250
    }
    expect(parseData(testData)).toEqual(({
      data: [3283.86, 3293.6, 3311.95, 3289.36, 3254.69, 3278.93, 3274.17, 3331.69, 3326.76, 3286.14, 3310.41, 3267.49],
      minValue: 1234.56,
      maxValue: 3331.69,
      klass: 'quote-up'
    }))
  })

  it('candle data format', () => {
    const data = [{
      begins_at: "2015-04-24T00:00:00Z",
      open_price: "128.1151",
      close_price: "127.9089",
      high_price: "128.2525",
      low_price: "126.8780",
      volume: 44525905,
      interpolated: false
    },
    {
      begins_at: "2015-04-27T00:00:00Z",
      open_price: "129.9020",
      close_price: "130.2358",
      high_price: "130.7070",
      low_price: "128.7631",
      volume: 96954207,
      interpolated: false
    },
    {
      begins_at: "2015-04-28T00:00:00Z",
      open_price: "132.0079",
      close_price: "128.1838",
      high_price: "132.0914",
      low_price: "127.2118",
      volume: 118923970,
      interpolated: false
    }],
    testData = {
      data: data,
      prevClose: 1234.56,
      displayPrevClose: true,
      selector: '.chart-placeholder',
      width: 480,
      height: 250
    }
    expect(parseData(testData, 'candle')).toEqual(({
      data: [{
        begins_at: "2015-04-24T00:00:00Z",
        open_price: 128.1151,
        close_price: 127.9089,
        high_price: 128.2525,
        low_price: 126.8780,
        volume: 44525905,
        interpolated: false
      },
      {
        begins_at: "2015-04-27T00:00:00Z",
        open_price: 129.9020,
        close_price: 130.2358,
        high_price: 130.7070,
        low_price: 128.7631,
        volume: 96954207,
        interpolated: false
      },
      {
        begins_at: "2015-04-28T00:00:00Z",
        open_price: 132.0079,
        close_price: 128.1838,
        high_price: 132.0914,
        low_price: 127.2118,
        volume: 118923970,
        interpolated: false
      }],
      minValue: 127.9089,
      maxValue: 1234.56,
      klass: 'quote-down'
    }))
  })
})
