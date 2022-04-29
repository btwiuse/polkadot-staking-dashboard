// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { ASSISTANT_CONFIG } from '../pages';

// context type
export interface AssistantContextState {
  toggle: () => void;
  setPage: (page: string) => void;
  setInnerDefinition: (meta: any) => void;
  getDefinition: (k: string, t: string) => any;
  openAssistant: () => any,
  closeAssistant: () => any,
  setActiveSection: (i: number) => void;
  goToDefinition: (k: string, t: string) => void;
  activeSection: number,
  open: number;
  page: string,
  innerDefinition: any,
}

// context definition
export const AssistantContext: React.Context<AssistantContextState> = React.createContext({
  toggle: () => { },
  setPage: (p: string) => { },
  setInnerDefinition: (m: any) => { },
  getDefinition: (k: string, t: string) => { },
  openAssistant: () => { },
  closeAssistant: () => { },
  setActiveSection: (i: number) => { },
  goToDefinition: (k: string, t: string) => { },
  activeSection: 0,
  open: 0,
  page: 'overview',
  innerDefinition: {},
});

// useAssistant
export const useAssistant = () => React.useContext(AssistantContext);

// wrapper component to provide components with context
export class AssistantContextWrapper extends React.Component {

  state = {
    open: 0,
    page: 'overview',
    innerDefinition: [],
    activeSection: 0,
  };

  setPage = (newPage: string) => {
    this.setState({
      ...this.state,
      page: newPage,
    })
  }

  getDefinition = (key: string, title: string) => {
    return ASSISTANT_CONFIG.find((item: any) => item.key === key)?.definitions.find((item: any) => item.title === title);
  }

  setInnerDefinition = (meta: any) => {
    this.setState({
      innerDefinition: meta,
    });
  }

  toggle = () => {
    this.setState({ open: this.state.open === 1 ? 0 : 1 })
  }

  openAssistant = () => {
    this.setState({ open: 1 });
  }

  closeAssistant = () => {
    this.setState({ open: 0 });
  }

  setActiveSection = (index: number) => {
    this.setState({
      activeSection: index,
    })
  }

  goToDefinition = (page: string, title: string) => {
    this.setPage(page);
    this.setInnerDefinition(this.getDefinition(page, title));
    this.setActiveSection(1);

    // short timeout to hide inner transition
    setTimeout(() => this.openAssistant(), 60);
  }

  render () {
    return (
      <AssistantContext.Provider value={{
        toggle: this.toggle,
        setPage: this.setPage,
        setInnerDefinition: this.setInnerDefinition,
        getDefinition: this.getDefinition,
        openAssistant: this.openAssistant,
        closeAssistant: this.closeAssistant,
        setActiveSection: this.setActiveSection,
        goToDefinition: this.goToDefinition,
        activeSection: this.state.activeSection,
        open: this.state.open,
        page: this.state.page,
        innerDefinition: this.state.innerDefinition,
      }}>
        {this.props.children}
      </AssistantContext.Provider>
    );
  }
}