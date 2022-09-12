import { ChevronDownIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { tryParseAmount, Type } from '@sushiswap/currency'
import { TradeType } from '@sushiswap/exchange'
import { FundSource } from '@sushiswap/hooks'
import { Button, Dots } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import { Checker } from '@sushiswap/wagmi'
import React, { FC, useCallback, useMemo, useState } from 'react'
import { useNetwork } from 'wagmi'

import { Layout, SettingsOverlay, SwapReviewModalLegacy, TradeProvider } from '../components'
import { CurrencyInput } from '../components/CurrencyInput'
import { SwapStatsDisclosure } from '../components/SwapStatsDisclosure'
import { useCustomTokens } from '../lib/state/storage'
import { useTokens } from '../lib/state/token-lists'

const Index: FC = () => {
  const { chain } = useNetwork()
  const chainId = chain?.id || ChainId.ETHEREUM
  const [input0, setInput0] = useState<string>('')
  const [token0, setToken0] = useState<Type | undefined>()
  const [input1, setInput1] = useState<string>('')
  const [token1, setToken1] = useState<Type | undefined>()
  const [tradeType, setTradeType] = useState<TradeType>(TradeType.EXACT_INPUT)

  const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(chainId)
  const tokenMap = useTokens(chainId)

  const [parsedInput0, parsedInput1] = useMemo(() => {
    return [tryParseAmount(input0, token0), tryParseAmount(input1, token1)]
  }, [input0, input1, token0, token1])

  const onInput0 = useCallback((val) => {
    setTradeType(TradeType.EXACT_INPUT)
    setInput0(val)
  }, [])

  const onInput1 = useCallback((val) => {
    setTradeType(TradeType.EXACT_OUTPUT)
    setInput1(val)
  }, [])

  return (
    <TradeProvider
      chainId={chainId}
      tradeType={tradeType}
      amountSpecified={tradeType === TradeType.EXACT_INPUT ? parsedInput0 : parsedInput1}
      mainCurrency={token0}
      otherCurrency={token1}
    >
      <Layout>
        <Widget id="swap" maxWidth={400}>
          <Widget.Content>
            <Widget.Header title="Swap">
              <SettingsOverlay chainId={chainId} />
            </Widget.Header>
            <CurrencyInput
              className="p-3"
              value={input0}
              onChange={onInput0}
              currency={token0}
              onSelect={setToken0}
              customTokenMap={customTokensMap}
              onAddToken={addCustomToken}
              onRemoveToken={removeCustomToken}
              chainId={chainId}
              tokenMap={tokenMap}
              inputType={TradeType.EXACT_INPUT}
              tradeType={tradeType}
            />
            <div className="flex items-center justify-center -mt-[12px] -mb-[12px] z-10">
              <button
                type="button"
                // TODO
                onClick={() => {}}
                className="group bg-slate-700 p-0.5 border-2 border-slate-800 transition-all rounded-full hover:ring-2 hover:ring-slate-500 cursor-pointer"
              >
                <div className="transition-all rotate-0 group-hover:rotate-180 group-hover:delay-200">
                  <ChevronDownIcon width={16} height={16} />
                </div>
              </button>
            </div>
            <div className="bg-slate-800">
              <CurrencyInput
                className="p-3"
                value={input1}
                onChange={onInput1}
                currency={token1}
                onSelect={setToken1}
                customTokenMap={customTokensMap}
                onAddToken={addCustomToken}
                onRemoveToken={removeCustomToken}
                chainId={chainId}
                tokenMap={tokenMap}
                inputType={TradeType.EXACT_OUTPUT}
                tradeType={tradeType}
              />
              <SwapStatsDisclosure />
              <div className="p-3 pt-0">
                <Checker.Connected fullWidth size="md">
                  <Checker.Network fullWidth size="md" chainId={chainId}>
                    <Checker.Amounts
                      fullWidth
                      size="md"
                      chainId={chainId}
                      fundSource={FundSource.WALLET}
                      amounts={[parsedInput0]}
                    >
                      <SwapReviewModalLegacy chainId={chainId}>
                        {({ isWritePending, setOpen }) => {
                          return (
                            <Button fullWidth onClick={() => setOpen(true)} disabled={isWritePending} size="md">
                              {isWritePending ? <Dots>Executing Swap</Dots> : 'Confirm Swap'}
                            </Button>
                          )
                        }}
                      </SwapReviewModalLegacy>
                    </Checker.Amounts>
                  </Checker.Network>
                </Checker.Connected>
              </div>
            </div>
          </Widget.Content>
        </Widget>
      </Layout>
    </TradeProvider>
  )
}

export default Index
