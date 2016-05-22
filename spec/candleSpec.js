import { getTickValues } from '../src/graphs/candle'
import d3 from 'd3'

describe('Candles', () => {
  it('line data format', () => {
    const data = [
      { begins_at: "2015-05-22T00:00:00Z" },
      { begins_at: "2015-05-23T00:00:00Z" },
      { begins_at: "2015-05-24T00:00:00Z" },
      { begins_at: "2015-05-25T00:00:00Z" },
      { begins_at: "2015-06-01T00:00:00Z" },
      { begins_at: "2015-06-02T00:00:00Z" },
      { begins_at: "2015-06-03T00:00:00Z" },
      { begins_at: "2015-06-04T00:00:00Z" },
      { begins_at: "2015-07-04T00:00:00Z" },
      { begins_at: "2015-07-05T00:00:00Z" },
      { begins_at: "2015-08-05T00:00:00Z" },
      { begins_at: "2016-01-01T00:00:00Z" },
    ]
    expect(getTickValues(data, d3.time.format('%Y-%m-%dT%H:%M:%SZ'))).toEqual([0, 4, 8, 10, 11])
  })
})
