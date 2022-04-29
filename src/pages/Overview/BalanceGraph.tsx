// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useApi, APIContext } from '../../contexts/Api';
import { useBalances } from '../../contexts/Balances';
import { useConnect } from '../../contexts/Connect';
import { planckToDot, fiatAmount, humanNumber } from '../../Utils';
import { useSize, formatSize } from '../../library/Graphs/Utils';
import { defaultThemes } from '../../theme/default';
import { useTheme } from '../../contexts/Themes';

ChartJS.register(ArcElement, Tooltip, Legend);

export const BalanceGraphInner = (props: any) => {

  const { mode } = useTheme();
  const { network }: any = useApi();
  const { activeAccount }: any = useConnect();
  const { getAccountBalance }: any = useBalances();
  const balance = getAccountBalance(activeAccount);

  const { prices } = props;
  let { free, miscFrozen } = balance;

  // get user's total DOT balance
  let freeDot = planckToDot(free);
  // convert balance to fiat value
  let freeBalance = fiatAmount(freeDot * prices.lastPrice);


  // convert to DOT unit
  free = planckToDot(free);

  let graphFrozen = planckToDot(miscFrozen);
  let graphFree = free - graphFrozen;

  let zeroBalance = false;
  if (graphFrozen === 0 && graphFree === 0) {
    graphFrozen = -1;
    graphFree = -1;
    zeroBalance = true;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    spacing: zeroBalance ? 0 : 5,
    plugins: {
      legend: {
        display: true,
        padding: {
          right: 10,
        },
        position: 'left' as const,
        align: 'center' as const,
        labels: {
          padding: 20,
          color: defaultThemes.text.primary[mode],
          font: {
            size: 15,
            weight: '500',
          },
        },
      },
      tooltip: {
        displayColors: false,
        backgroundColor: defaultThemes.graphs.tooltip[mode],
        bodyColor: defaultThemes.text.invert[mode],
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${context.parsed === -1 ? 0 : context.parsed} ${network.unit}`;
          },
        }
      }
    },
    cutout: '75%',
  };

  const data = {
    labels: ['Transferrable', 'Locked'],
    datasets: [
      {
        label: network.unit,
        data: [graphFree, graphFrozen],
        backgroundColor: [
          zeroBalance ? defaultThemes.graphs.inactive[mode] : defaultThemes.graphs.colors[0][mode],
          defaultThemes.graphs.colors[2][mode],
        ],
        borderWidth: 0,
      },
    ],
  };

  const ref: any = React.useRef();
  let size = useSize(ref.current);
  let { width, height, minHeight } = formatSize(size, 252);

  return (
    <>
      <div className='head' style={{ paddingTop: '0.5rem' }}>
        <h4>Balance</h4>
        <h2>{freeDot} {network.unit}&nbsp;<span className='fiat'>${humanNumber(freeBalance)}</span></h2>
      </div>
      <div style={{ paddingTop: '20px' }}></div>
      <div className='inner' ref={ref} style={{ minHeight: minHeight }}>
        <div className='graph' style={{ height: `${height}px`, width: `${width}px`, position: 'absolute' }}>
          <Doughnut
            options={options}
            data={data}
          />
        </div>
      </div>
      <div style={{ paddingTop: '25px' }}></div>
    </>
  );
}

export class BalanceGraph extends React.Component<any, any> {
  static contextType = APIContext;

  state = {
    prices: {
      lastPrice: 0,
      change: 0,
    },
  }

  stateRef: any;
  constructor (props: any) {
    super(props);
    this.stateRef = React.createRef();
    this.stateRef.current = this.state;
  }

  _setState (_state: any) {
    this.stateRef.current = _state;
    this.setState(_state);
  }

  // subscribe to price data
  priceHandle: any;
  initiatePriceInterval = async () => {
    const prices = await this.context.fetchDotPrice();
    this._setState({
      prices: prices
    });

    this.priceHandle = setInterval(async () => {
      const prices = await this.context.fetchDotPrice();
      this._setState({
        prices: prices
      });
    }, 1000 * 60);
  }

  // set up price feed interval
  componentDidMount () {
    this.initiatePriceInterval();
  }
  componentWillUnmount () {
    clearInterval(this.priceHandle);
  }

  shouldComponentUpdate (nextProps: any, nextState: any) {
    return ((nextProps.balances !== this.props.balances) || this.state.prices !== nextState.prices);
  }

  render () {
    return (
      <BalanceGraphInner {...this.props} prices={this.stateRef.current.prices} />
    )
  }
}

export default BalanceGraph;