import { Observable } from 'rx'
import EquityHistoricalData from '../../../models/equity-historical-data'
import QuoteHistoricalData from '../../../models/quote-historical-data'
import logger from '../../../logger'

export default (model$, dataInterval$) => Observable.merge(
  QuoteHistoricalData.stream$(model$, dataInterval$),
  EquityHistoricalData.stream$(model$, dataInterval$)
).do(s => logger.log('PORTFOLIO DATA - updated with:', s))
