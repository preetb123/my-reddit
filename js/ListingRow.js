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
    const listing = this.props.listing;
    return (
      <TouchableOpacity 
        onPress={this.props.onClick}>
        <View style={styles.container}>
          <Image 
            style={styles.previewImage}
            source={{uri: listing.thumbnail}}
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
