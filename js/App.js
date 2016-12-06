/**
 * @flow
 */
import React, { Component } from 'react';
import { StatusBar } from 'react-native';

import FrontPage from './FrontPage'
import StoryView from './StoryView';

import {
  createRouter,
  NavigationProvider,
  StackNavigation,
} from '@exponent/ex-navigation';

export const Router = createRouter(() => ({
  frontPage: () => FrontPage,
  storyView: () => StoryView
}));

export default class MyReddit extends Component {
  render() {
    return (
      <NavigationProvider router={Router}>
        <StatusBar 
          
          barStyle="light-content"
        />
        <StackNavigation initialRoute={Router.getRoute('frontPage')} />
      </NavigationProvider>
    );
  }
}