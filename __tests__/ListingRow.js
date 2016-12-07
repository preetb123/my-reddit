import 'react-native';
import React from 'react';
import ListingRow from '../js/ListingRow';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
    <ListingRow />
  );
});
