/**
 * @flow
 */

export type Listing = {
  domain: boolean;
  id: string;
  author: string;
  thumbnail: string;
  score: number;
  created_utc: number;
  url: string;
  title: string;
  num_comments: number;
  ups: number;
  downs: number;
  link_flair_text: string;
  permalink: string;
  post_hint: string;
  name: string;
};

const REDDIT_BASE_URL = 'http://www.reddit.com';

/**
 * Loads the listings based on nextToken. 
 * 
 * @export
 * @param {string} nextToken 
 * @param {number} [count=25]
 * @returns {Promise<any>} 
 */
export async function loadPosts(nextToken: string = null, count: number = 25): Promise<any>{
  const apiUrl = `${REDDIT_BASE_URL}/.json?${[
    `count=${encodeURIComponent(String(count))}`,
    `after=${encodeURIComponent(nextToken)}`
  ].join('&')}`;
  console.log("api_url: ", apiUrl);
  const { 
    data 
  } = await (await fetch(apiUrl)).json();  
  return data; 
} 