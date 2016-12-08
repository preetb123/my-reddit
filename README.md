# MyReddit [![Build Status](https://travis-ci.org/preetb123/my-reddit.svg?branch=master)](https://travis-ci.org/preetb123/my-reddit)
A simple [Reddit](https://www.reddit.com/) client for Android & iOS built using [React-Native](http://facebook.github.io/react-native/)

## Setup
Clone the repo and install the dependencies
```
git clone https://github.com/preetb123/my-reddit.git
cd my-reddit && npm install
```

### Running the app for Android & iOS
``` 
react-native run-android
react-native run-ios
```

### Using offline bundles
For Android: Run the below command while your packager is running
```sh
# create offline bundle and put it in assets dir 
curl "http://localhost:8081/index.android.bundle?platform=android" -o "android/app/src/main/assets/index.android.bundle"
# build the app
cd android && ./gradlew assembleRelease
# install on device/emulators
adb install app/build/outputs/apk/app-release-unaligned.apk
```
### TODO
- Add flow types wherever necessary
- Refining UI and minor performance optimizations
  - Proper colors for navigation bars and status bar on android
  - Appropriate placeholder images when the thumbnail is not available
- Error handling for network issues, server problem etc. 
- Tests with test coverage tools like [Coveralls](https://coveralls.io/)
- CI integration with travis
- CD with [Fastlane](https://fastlane.tools/) and deploying apk on github

### Third party libraries used
- [moment.js](http://momentjs.com/) for relative time string
- [Ex-Navigation](https://github.com/exponentjs/ex-navigation) for navigation
