/**
 * @flow
 */
import React, {Component} from 'react';
import {  
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ListView,
  RefreshControl,
  ActivityIndicator
} from 'react-native';

import { loadPosts } from './reddit-api';
import { Router } from './App';
import ListingRow from './ListingRow';

export default class FrontPage extends Component {
  static route = {
    navigationBar: {
      title: 'My Reddit'
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      listings: [],
      isRefreshing: false,
      isLoadingMore: false,
      hasError: false,
      nextToken: null,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
    };
  }

  componentDidMount() {
    console.log("componentDidMount");
    this.setState({
      isLoadingMore: true
    });
    this.fetchData().done();
    // this.setTimeout(() => {
    //   this.fetchData().done();
    // }, (1000 * 15));
  }

  componentWillUnmount() {
    // clear the timeout
  }

  async fetchData(){
    try{
      const data = await loadPosts(this.state.nextToken);
      const newListings = this.state.listings.concat(data.children);
      this.setState({
        hasError: false,
        isLoadingMore: false,
        isRefreshing: false,
        nextToken: data.after,
        listings: newListings,
        dataSource: this.state.dataSource.cloneWithRows(newListings)
      });
    }catch(err){
      console.log("error: ", err);
      this.setState({
        isLoadingMore: false,
        isRefreshing: false,
        hasError: true
      });
    }
  }

  _viewStory(data){
    this.props.navigator.push(Router.getRoute('storyView', {url: data.url, title: data.title}));  
  }

  _onRefresh = () => {
    console.log("onRefresh");
    this.setState({
      isRefreshing: true,
      nextToken: null,
      listings: []
    }, () => {
      this.fetchData();
    });  
  }

  _onEndReached = () => {
    console.log("onEndReached");
    this.setState({
      isLoadingMore: true
    });
    this.fetchData().done();    
  }

  _renderFooter = () => {
    console.log("renderFooter");
    if(this.state.isLoadingMore){
      return (
        <ActivityIndicator
          style={styles.activityIndicator}  
        />
      );
    }else{
      return null;
    }
  }

  _renderSeparator = (sectionID, rowID, adjacentRowHighlighted) => {
    return (
      <View
        key={rowId}
        style={styles.itemSeparator}
      />
    );
  }

  render(){
    console.log("renderFrontPage");
    if(this.state.hasError){
      return (
        <View style={styles.container}>
          <Text>
            Something went wrong!
          </Text>  
        </View>
      );
    }
    if(this.state.isLoadingMore && this.state.listings.length == 0){
      return (
        <ActivityIndicator
          style={styles.activityIndicator}  
        />
      );
    }
    return (
      <ListView
        style={styles.listView}
        dataSource={this.state.dataSource}
        onEndReached={this._onEndReached}
        onEndReachedThreshold={10}
        renderFooter={this._renderFooter}
        renderSeparator={() => this._renderSeparator}
        renderRow={
          (data) => <ListingRow
                      key={data.data.id}
                      listing={data.data}
                      onClick={ () => this._viewStory(data.data) }
                    />
        }
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this._onRefresh}
          />
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  listView: {
    flex: 1
  },
  error: {
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#CCCCCC'
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
  }
});