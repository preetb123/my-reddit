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
  offset: number;
  hasMore: boolean;
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
  static defaultProps = {
    offset: 0
  };

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
      offset: this.props.offset,
      nextToken: null,
      hasMore: true,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
    };
  }

  componentDidMount() {
    console.log("componentDidMount");
    // loadMore
    this.fetchData(false, false, true).done();
    if(!this.autoRefreshHandler){
      this.setupPeriodicRefresh();
    }
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  setupPeriodicRefresh(){
    console.log("setting up periodic updates");
    // setup the interval for periodic refresh
    this.autoRefreshHandler = setInterval(() => {
      console.log("refreshing contents");
      // autoRefresh
      this.fetchData(true, false, false).done();
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
        () => this.setupPeriodicRefresh();
      }
    }
  }

  async fetchData(autoRefresh, manualRefresh, loadMore){
    console.log("fetchData");
    if(this.state.isLoadingMore || this.state.isRefreshing || !this.state.hasMore || this.state.hasError)
      return;
    let nextToken;
    let offset;
    if(autoRefresh){
      // replace the first 25 rows with the new data
      // no indicator will be shown
      nextToken = null;
      offset = 0;
    }else if(manualRefresh){
      // replace the entire data with new data
      // pull to refresh indicator will be shown
      this.setState({
        isRefreshing: true,
        hasMore: true
      });
      nextToken = null;
      offset = 0;
    }else if(loadMore){
      // infinite scroll
      this.setState({
        isLoadingMore: true
      });
      // append the new data to the current data 
      nextToken = this.state.nextToken;
      offset = this.state.offset;
    }
    try{
      const data = await loadPosts(nextToken, offset);
      console.log("dataSource before: ", this.state.dataSource.getRowCount());
      let newListings;
      if(autoRefresh){
        if(this.state.listings.length > 25){
          newListings = data.children.concat(
            this.state.listings.slice(25, this.state.listings.length)
          );
          nextToken = this.state.nextToken;
          offset = this.state.offset;
        }else{
          newListings = data.children;
          nextToken = data.after;
          offset = data.children.length
        }
      }else if(manualRefresh){
        newListings = data.children;
        nextToken = data.after;
        offset = data.children.length
      }else if(loadMore){
        newListings = this.state.listings.concat(data.children);
        nextToken = data.after;
        offset = this.state.offset + data.children.length;
      }
      this.setState({
        hasError: false,
        isLoadingMore: false,
        isRefreshing: false,
        nextToken: nextToken,
        offset: offset,
        listings: newListings,
        hasMore: (nextToken == null) ? false : true,  
        dataSource: this.state.dataSource.cloneWithRows(newListings)
      }, () => {
        console.log("dataSource after: ", this.state.dataSource.getRowCount());
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
    // manualRefresh
    this.fetchData(false, true, false).done();  
  }

  _onEndReached = () => {
    console.log("onEndReached");
    // loadMore
    this.fetchData(false, false, true).done();    
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