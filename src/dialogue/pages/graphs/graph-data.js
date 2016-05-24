import { Observable } from 'rx'
import QuoteHistoricalData from '../../../models/quote-historical-data'

export default (model$) =>
  QuoteHistoricalData.streamCurrentInstrument$(model$, Observable.just('1Y'), 'candle', '100%', 800)
