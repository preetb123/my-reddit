/**
 * @flow
 */
import React, {Component} from 'react';
import { Router } from './App';
import { WebView } from 'react-native';
 
export default class StoryView extends Component {
  // set the actual title of the reddit story. params.title
  static route = {
    navigationBar: {
      title(params){
        return 'Story';
      }
    }
  }

  render() {
    let url;
    let receivedUrl = this.props.route.params.url;
    if(receivedUrl.includes('amp;')){
      url = receivedUrl.replace(new RegExp('amp;', 'g'), '');
    }else{
      url = receivedUrl;
    }
    console.log("opening url: ", url);
    return (
      <WebView 
        source={{ uri: url }}
        javaScriptEnabled={true}
        startInLoadingState={true}
      />
    );
  }
}