import 'react-native';
import React from 'react';
import StoryView from '../js/StoryView';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
    <StoryView />
  );
});
