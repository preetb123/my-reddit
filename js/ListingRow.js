/**
 * @flow
 */
import React, {Component} from 'react';
import { 
  Text, 
  Image, 
  View, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native'; 
// for relative time strings from epoch value
import moment from 'moment';
import type { Listing } from './reddit-api';

type State = {

};

type Props = {
  listing: Listing;
};

/**
 * Row for the Reddit front page ListView
 * 
 * @export
 * @class ListingRow
 * @extends {Component}
 */
export default class ListingRow extends Component {
  render() {
    const ALL_IMAGES_BY_ID = {
      'reddit_default': require('./img/place_holder.png'),
    };  
    const listing = this.props.listing;
    let previeImageUrl;
    if(listing.thumbnail === 'default') {
      previeImageUrl = ALL_IMAGES_BY_ID.reddit_default;
    }else if(listing.thumbnail === 'self'){
      previeImageUrl = ALL_IMAGES_BY_ID.reddit_default;
    }else if(listing.thumbnail === 'nsfw'){
      previeImageUrl = ALL_IMAGES_BY_ID.reddit_default;
    }else{
      previeImageUrl = {uri: listing.thumbnail};
    }

    return (
      <TouchableOpacity 
        onPress={this.props.onClick}>
        <View style={styles.container}>
          <Image 
            style={styles.previewImage}
            source={previeImageUrl}
          />
          <View style={styles.textContainer}>
            <Text>{listing.title}</Text>
            <Text style={styles.details}>
              {moment(listing.created_utc, "X").startOf('seconds').fromNow()}
              {' • '}
              by { listing.author }
              {' • '}
              {'\u2605'}
              {listing.score}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 8
  },
  previewImage:{
    backgroundColor: '#dddddd',
    height: 60,
    marginRight: 10,
    width: 70,
  },
  textContainer: {
    flex: 1,
    paddingTop: 1
  },
  title: {
    fontSize: 17,
    color: '#333',
    marginBottom: 4
  },
  postTime: {

  },
  author:{  
    fontWeight: 'bold'
  },
  votes: {
    height: 10,
    width: 10,
    padding: 8
  },
  details: {
    fontSize: 12,
    color: '#999',
    alignItems: 'center'
  }
});
