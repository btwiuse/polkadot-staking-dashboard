// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { MaybeAccount } from 'types';
import {
  ActivePoolContextState,
  BondedPoolsContextState,
  PoolMembershipsContextState,
  PoolsConfigContextState,
} from 'contexts/Pools/types';

export const stats = {
  counterForPoolMembers: new BN(0),
  counterForBondedPools: new BN(0),
  counterForRewardPools: new BN(0),
  maxPoolMembers: new BN(0),
  maxPoolMembersPerPool: new BN(0),
  maxPools: new BN(0),
  minCreateBond: new BN(0),
  minJoinBond: new BN(0),
};

export const targets = {
  nominations: [],
};

export const nominations = {
  targets: [],
  submittedIn: 0,
};

export const poolMembership = null;

export const poolBondOptions = {
  active: new BN(0),
  freeToBond: new BN(0),
  freeToUnbond: new BN(0),
  totalUnlocking: new BN(0),
  totalUnlocked: new BN(0),
  totalPossibleBond: new BN(0),
  totalUnlockChuncks: 0,
};

export const nominationStatus = {};

export const defaultActivePoolContext: ActivePoolContextState = {
  isBonding: () => false,
  isNominator: () => false,
  isOwner: () => false,
  isDepositor: () => false,
  getPoolBondedAccount: () => null,
  // eslint-disable-next-line
  getPoolBondOptions: (a: MaybeAccount) => null,
  getPoolUnlocking: () => [],
  // eslint-disable-next-line
  setTargets: (targest: any) => {},
  getNominationsStatus: () => nominationStatus,
  activeBondedPool: {},
  targets: [],
  poolNominations: [],
};

export const defaultBondedPoolsContext: BondedPoolsContextState = {
  // eslint-disable-next-line
  fetchPoolsMetaBatch: (k: string, v: [], r?: boolean) => {},
  // eslint-disable-next-line
  createAccounts: (p: number) => {},
  // eslint-disable-next-line
  getBondedPool: (p: number) => [],
  bondedPools: [],
  meta: {},
};

export const defaultPoolMembershipsContext: PoolMembershipsContextState = {
  memberships: [],
  membership: null,
};

export const defaultPoolsConfigContext: PoolsConfigContextState = {
  enabled: 0,
  stats: {},
};