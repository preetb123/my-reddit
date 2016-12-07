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
  ActivityIndicator,
  AppState
} from 'react-native';

import { loadPosts } from './reddit-api';
import { Router } from './App';
import ListingRow from './ListingRow';
import type { Listing } from './reddit-api';

type State = {
  listing: Array<Listing>;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  hasError: boolean;
  nextToken: string;
  dataSource: ListView.DataSource;
};

type Props = {
  route: ExNavigationRoute;  
};

/**
 * Screen displaying Reddit front page.
 * The contents auto-refresh every 30 seconds.
 * @export
 * @class FrontPage
 * @extends {Component}
 */
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

    if(!this.autoRefreshHandler){
      this.setupPeriodicRefresh();
    }
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  setupPeriodicRefresh = () => {
    console.log("setting up periodic updates");
    // setup the interval for periodic refresh
    this.autoRefreshHandler = setInterval(() => {
      if(this.state.isRefreshing || this.state.isLoadingMore){
        return;
      }
      console.log("refreshing contents");
      this.setState({
        nextToken: null,
        listings: []
      }, () => {
        this.fetchData().done();
      });
    }, (1000 * 30));
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
    // clear the interval
    clearInterval(this.autoRefreshHandler);

    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange(currentAppState){
    console.log("current app state: ", currentAppState);  
    if(currentAppState === 'background'){
      console.log("app going to background");
      if(this.autoRefreshHandler){
        console.log("disabling periodic updates");
        clearInterval(this.autoRefreshHandler);
        this.autoRefreshHandler = null;
      }
    }else if(currentAppState === 'active'){
      if(!this.autoRefreshHandler){
        this.setupPeriodicRefresh();
      }
    }
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
        key={`${sectionID}-${rowID}`}
        style={{
          marginLeft: 4,
          marginRight: 4,
          height: adjacentRowHighlighted ? 4 : StyleSheet.hairlineWidth,
          backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
        }} 
      />
    );
  }

  render(){
    console.log("renderFrontPage");
    if(this.state.hasError){
      return (
        <View style={styles.container}>
          <Text style={styles.error}>
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
        renderSeparator={this._renderSeparator}
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
    fontSize: 40,
    margin: 10,
    paddingTop: 64
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
  }
});