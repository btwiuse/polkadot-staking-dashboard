// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonSecondary } from '@rossbulat/polkadot-dashboard-ui';
import { useConnect } from 'contexts/Connect';
import { useUi } from 'contexts/UI';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { HeaderProps } from '../types';
import { Wrapper } from './Wrapper';

export const Header = (props: HeaderProps) => {
  const { title, helpKey, complete, thisSection, setupType } = props;

  const { activeAccount } = useConnect();
  const { getSetupProgress, setActiveAccountSetupSection } = useUi();
  const setup = getSetupProgress(setupType, activeAccount);

  return (
    <Wrapper>
      <section>
        <h2>
          {title}
          {helpKey !== undefined && <OpenHelpIcon helpKey={helpKey} />}
        </h2>
      </section>
      <section>
        {complete && (
          <>
            {setup.section !== thisSection && thisSection < setup.section && (
              <span>
                <ButtonSecondary
                  text="Update"
                  onClick={() => {
                    setActiveAccountSetupSection(setupType, thisSection);
                  }}
                />
              </span>
            )}
            <h4 className="complete">Complete</h4>
          </>
        )}
      </section>
    </Wrapper>
  );
};

export default Header;