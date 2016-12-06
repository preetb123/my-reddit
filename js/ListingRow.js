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

import moment from 'moment';

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
              {listing.score}
              {' • '}
              {moment(listing.created_utc, "X").startOf('seconds').fromNow()}
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
  },
  title: {
    fontSize: 17,
    color: '#333',
    marginBottom: 4
  },
  postTime: {

  },
  votes: {

  },
  details: {
    fontSize: 12,
    color: '#999',
  }
});
