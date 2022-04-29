import { LinearGradient } from '@visx/gradient'
import { Group } from '@visx/group'
import { scaleOrdinal } from '@visx/scale'
import { Pie } from '@visx/shape'
import { Text } from '@visx/text'
import { useStreamBalance } from 'app/hooks'
import { Amount, Token } from '@sushiswap/currency'
import { FC, useEffect, useState } from 'react'
import { Stream } from '../context/Stream'

interface Props {
  stream: Stream
}
const BalanceChart: FC<Props> = (props) => {
  const stream = props.stream
  const [formattedBalance, setFormattedBalance] = useState<Amount<Token>>(null)
  const [streamed, setStreamed] = useState([])
  const [withdrawn, setWithdrawn] = useState([])
  const balance = useStreamBalance(stream.id)

  useEffect(() => {
    if (!balance || !stream) {
      return
    }
    setFormattedBalance(Amount.fromRawAmount(stream.token, balance.toString()))
  }, [balance, stream])

  useEffect(() => {
    if (stream) {
      setStreamed([
        {
          type: 'Streamed',
          amount: stream?.streamedAmount,
          color: '#1398ED',
        },
        {
          type: 'Not streamed',
          amount: stream?.unclaimableAmount,
          color: '#1398ED',
          opacity: '0%',
        },
      ])
      setWithdrawn([
        {
          type: 'Withdrawn',
          amount: stream.withdrawnAmount.toExact(),
          color: '#f43fc5',
          opacity: '100%',
        },
        {
          type: 'Not available',
          amount: stream.amount.subtract(stream.withdrawnAmount).toExact(),
          color: '#f43fc5',
          opacity: '0%',
        },
      ])
    }
  }, [stream])

  const width = 420
  const half = width / 2
  const [active, setActive] = useState(null)

  const color = scaleOrdinal<number, string>({
    domain: [0, 1],
    range: ['url(#gblue)', 'url(#gpink)'],
  })

  if (!streamed) {
    return
  }

  return (
    <svg width={width} height={width}>
      <LinearGradient id="gblue" from={'#1398ED'} to={'#5CB0E4'} vertical={false} />
      <LinearGradient id="gpink" from={'#FFA6E7'} to={'#f43fc5'} vertical={false} />
      <Group top={half} left={half}>
        <Pie
          data={streamed}
          pieSort={null}
          pieValue={(data) => data.amount}
          startOffset={0}
          outerRadius={half}
          innerRadius={() => {
            const size = 10
            return half - size
          }}
          cornerRadius={3}
          padAngle={0.005}
        >
          {(pie) => {
            return pie.arcs.map((arc) => {
              return (
                <g key={arc.data.type} onMouseEnter={() => setActive(arc.data)} onMouseLeave={() => setActive(null)}>
                  <path d={pie.path(arc)} fill={color(0)} opacity={arc.data.opacity} />
                </g>
              )
            })
          }}
        </Pie>
        <Pie
          data={withdrawn}
          pieSort={null}
          startOffset={0}
          pieValue={(data) => data.amount}
          outerRadius={half * 0.87}
          innerRadius={() => {
            const size = 15
            return half - size
          }}
          cornerRadius={3}
          padAngle={0.05}
        >
          {(pie) => {
            return pie.arcs.map((arc) => {
              return (
                <g key={arc.data.type} onMouseEnter={() => setActive(arc.data)} onMouseLeave={() => setActive(null)}>
                  <path d={pie.path(arc)} fill={color(1)} opacity={arc.data.opacity} />
                </g>
              )
            })
          }}
        </Pie>

        {active ? (
          <>
            <Text textAnchor="middle" fill="#fff" fontSize={40} dy={-20}>
              {active.type == 'Withdrawn'
                ? `${stream?.withdrawnAmount.toExact()} ${stream?.token.symbol}`
                : `${stream?.amount.toExact()} ${stream?.token.symbol}`}
            </Text>
            <Text textAnchor="middle" fill={active.color} fontSize={20} dy={20}>
              {active?.type}
            </Text>
          </>
        ) : (
          <>
            <Text textAnchor="middle" fill="#fff" fontSize={40} dy={-20}>
              {`${formattedBalance ? formattedBalance.toSignificant(6) : '0'} ${stream?.token.symbol}`}
            </Text>
            <Text textAnchor="middle" fill="#aaa" fontSize={20} dy={20}>
              {`/ ${formattedBalance ? stream.amount.toExact() : '0'} ${stream?.token.symbol} Total`}
            </Text>
          </>
        )}
      </Group>
    </svg>
  )
}
export default BalanceChart
