/**
 * @flow
 */
import React, {Component} from 'react';
import { Router } from './App';
import type { ExNavigationRoute } from '@exponent/ex-navigation';

import { 
  WebView, 
  Text, 
  Platform, 
  StyleSheet 
} from 'react-native';
 
type Props = {
  route: ExNavigationRoute;
};

type State = {
};

/**
 * This Component displays the contents of the url in a WebView
 * 
 * @export
 * @class StoryView
 * @extends {Component}
 */
export default class StoryView extends Component {
  // set the actual title of the reddit story. params.title
  // TODO: Display the the title instead of hardcoded value. Need to 
  // modify the appearance of the navigation bar
  static route = {
    navigationBar: {
      renderTitle: (route) => {
        console.log("title: ", route.params);
        let titleStyle = (Platform.OS === 'ios') ? 
        styles.titleIOS : styles.titleAndroid;
        return <Text  
                 style={titleStyle}  
                 ellipsizeMode='tail' 
                 numberOfLines={1}>
                 {route.params.title}
               </Text>
      }
    }
  }

  render() {
    let url;
    let receivedUrl = this.props.route.params.url;
    // replace the escape character(&amp;) with & 
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
        automaticallyAdjustContentInsets={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  titleIOS: { 
    marginLeft: 48, 
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16
  },
  titleAndroid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    fontSize: 16
  }
});