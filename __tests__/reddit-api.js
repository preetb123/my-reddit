import 'react-native';
jest.mock('../js/reddit-api');

import * as RedditAPI from '../js/reddit-api';

it('reddit api returning frontpage data', async () => {
  const response = await RedditAPI.loadPosts();
  expect(response.children).toHaveLength(25);
});