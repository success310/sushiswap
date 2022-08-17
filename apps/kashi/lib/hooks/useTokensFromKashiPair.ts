import { Native, Token } from '@sushiswap/currency'
import { useMemo } from 'react'

import { KashiPair } from '../../.graphclient'

export const useTokensFromKashiPair = (pair: KashiPair) => {
  return useMemo(
    () => ({
      asset:
        Native.onChain(pair.chainId).wrapped.address.toLowerCase() === pair.asset.id.toLowerCase()
          ? Native.onChain(pair.chainId)
          : new Token({
              address: pair.asset.id,
              name: pair.asset.name,
              decimals: Number(pair.asset.decimals),
              symbol: pair.asset.symbol,
              chainId: pair.chainId,
            }),
      collateral:
        Native.onChain(pair.chainId).wrapped.address.toLowerCase() === pair.collateral.id.toLowerCase()
          ? Native.onChain(pair.chainId)
          : new Token({
              address: pair.collateral.id,
              name: pair.collateral.name,
              decimals: Number(pair.collateral.decimals),
              symbol: pair.collateral.symbol,
              chainId: pair.chainId,
            }),
    }),
    [
      pair.chainId,
      pair.asset.decimals,
      pair.asset.id,
      pair.asset.name,
      pair.asset.symbol,
      pair.collateral.decimals,
      pair.collateral.id,
      pair.collateral.name,
      pair.collateral.symbol,
    ]
  )
}
