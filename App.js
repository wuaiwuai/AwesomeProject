/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  AsyncStorage,
  FlatList,
} from 'react-native';

export default class App extends Component {
  state = {
    data: null,
  };

  /* -------------- *
   * CUSTOM METHODS *
   * -------------- */

  /**
   * fetchData
   */
  fetchData() {
    const dataUrl = 'https://www.reddit.com/.json';
    console.log('Fetching data from: ', dataUrl);

    return fetch(dataUrl)
      .then(response => response.json())
      .then((responseJson) => {
        this.saveData(responseJson.data.children);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * saveData
   * @param {*} payload
   */
  async saveData(payload) {
    try {
      await AsyncStorage.setItem('redditData', JSON.stringify(payload));
      this.setState({ data: payload });
    } catch (error) {
      console.log('Error saving data: ', error);
    }
  }

  /**
   * getData
   * @param {*} cb
   */
  async getData(cb) {
    try {
      const payload = await AsyncStorage.getItem('redditDatafds');
      if (payload !== null) {
        // We have data!!
        console.log('Data found.');
        this.setState({ data: JSON.parse(payload) });
        return;
      }
      throw new Error('No data found.');
    } catch (error) {
      console.log('Error retrieving data: ', error);
      cb();
    }
  }

  /* ----------------- *
   * LIFECYCLE METHODS *
   * ----------------- */

  /**
   * componentWillMount
   */
  componentWillMount() {
    /**
     * first check to see if data exists in AsyncStorage
     * if that fails, run the cb and fetchData
     * another way to write the getData function using its cb:
     * this.getData(() => this.fetchData())
     */
    this.getData()
      .catch((error) => {
        console.log(error);
        this.fetchData();
      });
  }

  /**
   * render
   */
  render() {
    return (
      <FlatList
        data={this.state.data}
        renderItem={({ item }) => <Text>{item.data.title}</Text>}
        keyExtractor={(item, index) => index}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
