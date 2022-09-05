import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { PoolPositionProvider, usePoolPosition } from '../../PoolPositionProvider'
import { PoolPositionStakedProvider, usePoolPositionStaked } from '../../PoolPositionStakedProvider'
import { CellWithBalanceProps } from './types'

export const PairPositionCell: FC<CellWithBalanceProps> = ({ row }) => {
  return (
    <PoolPositionProvider pair={row}>
      <PoolPositionStakedProvider pair={row}>
        <_PairPositionCell row={row} />
      </PoolPositionStakedProvider>
    </PoolPositionProvider>
  )
}

const _PairPositionCell: FC<CellWithBalanceProps> = () => {
  const { value1, value0 } = usePoolPosition()
  const { value0: stakedValue0, value1: stakedValue1, underlying0, underlying1 } = usePoolPositionStaked()

  console.log(value0, value1, stakedValue0, stakedValue1, underlying0?.toSignificant(6), underlying1?.toSignificant(6))
  return (
    <Typography variant="sm" weight={600} className="text-slate-50 text-right">
      {formatUSD(value0 + value1 + stakedValue0 + stakedValue1)}
    </Typography>
  )
}
