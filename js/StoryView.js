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
    return (
      <WebView 
        source={{ uri: this.props.route.params.url }}
        javaScriptEnabled={true}
        startInLoadingState={true}
      />
    );
  }
}