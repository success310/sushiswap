import { AddressZero } from '@ethersproject/constants'
import { Amount, Token } from '@sushiswap/currency'
import { useMemo } from 'react'
import { erc20ABI, useContractRead } from 'wagmi'

export function useTokenAllowance(watch: boolean, token?: Token, owner?: string, spender?: string): Amount<Token> | undefined {
  const { data, error, isLoading } = useContractRead(
    {
      addressOrName: token?.address ?? AddressZero,
      contractInterface: erc20ABI,
    },
    'allowance',
    { args: useMemo(() => [owner, spender], [owner, spender]), watch },
  )

  return data ? Amount.fromRawAmount(token, data.toString() ?? undefined) : undefined
}
