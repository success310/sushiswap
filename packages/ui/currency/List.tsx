import { Type } from '@sushiswap/currency'
import classNames from 'classnames'
import React, { createContext, CSSProperties, FC, ReactNode, useCallback, useContext, useMemo } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'

import { Typography } from '../typography'
import { Icon } from './Icon'

export interface WithCurrencyList {
  className?: string
  currencies: Type[]
  currency?: Type
  onCurrency(x: Type): void
  children?: ReactNode
}

const CurrencyListContext = createContext<WithCurrencyList | undefined>(undefined)

const useCurrencyListContext = () => {
  const context = useContext(CurrencyListContext)
  if (!context) {
    throw new Error('Hook can only be used within CurrencyList context')
  }

  return context
}

const CurrencyRow: FC<{
  currency: Type
  style: CSSProperties
}> = ({ currency, style }) => {
  const { onCurrency } = useCurrencyListContext()

  return (
    <button
      type="button"
      onClick={() => onCurrency(currency)}
      className={classNames(`group flex items-center w-full hover:bg-blue-600 px-4 py-2 token-${currency?.symbol}`)}
      style={style}
    >
      <div className="flex items-center justify-between flex-grow gap-2 rounded cursor-pointer">
        <div className="flex flex-row items-center flex-grow gap-1">
          <div className="w-6 h-6">
            <Icon currency={currency} width={24} height={24} />
          </div>
          <div className="flex flex-col items-start">
            <Typography variant="xxs" className="text-slate-500 group-hover:text-blue-100">
              {currency.name}
            </Typography>
            <Typography variant="xs" weight={700} className="text-slate-200 group-hover:text-slate-50">
              {currency.symbol}
            </Typography>
          </div>
        </div>
      </div>
    </button>
  )
}

const BREAK_LINE = 'BREAK'
type BreakLine = typeof BREAK_LINE
function isBreakLine(x: unknown): x is BreakLine {
  return x === BREAK_LINE
}

const BreakLineComponent: FC<{ style: CSSProperties }> = ({ style }) => {
  return (
    <div className="flex w-full px-4 border-t border-slate-700" style={style}>
      <div className="flex flex-col gap-0.5 justify-center">
        <Typography variant="xs" weight={700}>
          Expanded results from inactive token lists
        </Typography>
        <Typography variant="xxs">
          Tokens from inactive lists: import specific tokens below or click manage to activate more lists.
        </Typography>
      </div>
    </div>
  )
}

const withContext =
  (Component: React.ComponentType<{ children?: ReactNode; className?: string }>): React.FC<WithCurrencyList> =>
  ({ currencies, currency, onCurrency, children, className }) =>
    (
      <CurrencyListContext.Provider
        value={useMemo(() => ({ currency, onCurrency, currencies }), [currencies, currency, onCurrency])}
      >
        <Component className={className}>{children}</Component>
      </CurrencyListContext.Provider>
    )

export const List = withContext(({ className }) => {
  const { currencies } = useCurrencyListContext()

  const Row = useCallback(
    ({ index, style }: { index: number; style: CSSProperties }) => {
      const currency = currencies[index]
      if (isBreakLine(currency)) {
        return <BreakLineComponent style={style} />
      }

      return <CurrencyRow currency={currency} style={style} />
    },
    [currencies]
  )

  return (
    <div
      className={classNames(className, 'lg:max-h-[calc(100%-108px)] rounded-xl overflow-hidden h-full bg-slate-800')}
    >
      <AutoSizer>
        {({ height, width }: { height: number; width: number }) => (
          <FixedSizeList
            height={height}
            width={width}
            itemCount={currencies.length}
            itemSize={42}
            className="h-full divide-y hide-scrollbar divide-slate-700"
          >
            {Row}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  )
})
