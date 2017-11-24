import React from 'react';
import { mount } from 'enzyme';

import Aggregations from 'components/aggregations';
import store from 'stores';
import styles from './aggregations.less';

describe('Aggregations [Component]', () => {
  let component;

  beforeEach(() => {
    component = mount(<Aggregations store={store} />);
  });

  afterEach(() => {
    component = null;
  });

  it('renders the correct root classname', () => {
    expect(component.find(`.${styles.root}`)).to.be.present();
  });
});
