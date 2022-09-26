import { SUPPORTED_CHAIN_IDS } from 'config'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FC } from 'react'
import { SWRConfig, unstable_serialize } from 'swr'

import { ChartSection, Layout, PoolsFiltersProvider, TableSection } from '../components'
import {
  getBundles,
  getCharts,
  getPoolCount,
  getPools,
  GetPoolsQuery,
  getTokenCount,
  getTokens,
  GetTokensQuery,
} from '../lib/api'

export const getServerSideProps: GetServerSideProps = async ({ req, query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600')
  const [pairs, tokens, charts, poolCount, tokenCount, bundles] = await Promise.all([
    getPools(query as unknown as GetPoolsQuery),
    getTokens(query as unknown as GetTokensQuery),
    getCharts(query as { networks: string }),
    getPoolCount(),
    getTokenCount(),
    getBundles(),
  ])

  return {
    props: {
      fallback: {
        [unstable_serialize({
          url: '/analytics/api/pools',
          args: {
            sorting: [
              {
                id: 'liquidityUSD',
                desc: true,
              },
            ],
            selectedNetworks: SUPPORTED_CHAIN_IDS,
            pagination: {
              pageIndex: 0,
              pageSize: 20,
            },
            query: '',
            extraQuery: '',
          },
        })]: pairs,
        [unstable_serialize({
          url: '/analytics/api/tokens',
          args: {
            sorting: [
              {
                id: 'liquidityUSD',
                desc: true,
              },
            ],
            selectedNetworks: SUPPORTED_CHAIN_IDS,
            pagination: {
              pageIndex: 0,
              pageSize: 20,
            },
            query: '',
            extraQuery: '',
          },
        })]: tokens,

        [unstable_serialize({
          url: '/analytics/api/charts',
          args: {
            selectedNetworks: SUPPORTED_CHAIN_IDS,
          },
        })]: charts,
        [`/analytics/api/pools/count`]: poolCount,
        [`/analytics/api/tokens/count`]: tokenCount,
        [`/analytics/api/bundles`]: bundles,
      },
    },
  }
}

const Index: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Index />
    </SWRConfig>
  )
}

const _Index = () => {
  return (
    <Layout>
      <div className="flex flex-col gap-10">
        <section className="flex flex-col gap-6 lg:flex-row">
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-semibold text-slate-50">Sushi Analytics</h2>
            <p className="text-slate-300">
              Dive deeper in the analytics of Sushi Bar, BentoBox, Pools, Farms and Tokens.
            </p>
          </div>
        </section>
        <PoolsFiltersProvider>
          <ChartSection />
          <TableSection />
        </PoolsFiltersProvider>
      </div>
    </Layout>
  )
}

export default Index
