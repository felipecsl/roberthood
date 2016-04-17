import {Observable} from 'rx'
import moment from 'moment'
import EquityHistoricalData from '../../../models/equity-historical-data'
import QuoteHistoricalData from '../../../models/quote-historical-data'

const data$ = (model$, dataInterval$) => Observable.merge(
  QuoteHistoricalData.stream$(model$, dataInterval$),
  EquityHistoricalData.stream$(model$, dataInterval$))

export default data$
