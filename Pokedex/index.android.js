'use strict';

var React = require('react-native');
var tts = require('react-native-android-speech')
var GiftedSpinner = require('react-native-gifted-spinner');
var _ = require('lodash');

var {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ListView
} = React;

var api = require('./src/api.js')

var Pokedex = React.createClass({
    getInitialState: function(){
      return {
        query: null,
        hasResult: false,
        noResult: false,
        result: null,
        isLoading: false,
        dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        })
      }
    },

    render: function() {
      return (
        <View style={styles.container}>
          <View style={styles.search}>
            <TextInput
              style={styles.text_input}
              onChangeText={this.changeText}
              onSubmitEditing={this.search}
              placeholder="Type a pokemon name"
            />
          </View>

          {
            this.state.hasResult &&

            <View style={styles.result}>
              <View style={styles.main_details}>
                <Image source={{uri: this.state.result.small_photo}}
                       style={styles.image_dimensions} resizeMode={Image.resizeMode.contain} />
                <Text style={styles.main_text}>{this.state.result.name}</Text>

                <ListView contentContainerStyle={styles.types} dataSource={this.state.types} renderRow={this.renderType}></ListView>

                <View style={styles.description}>
                  <Text style={styles.description_text}>{this.state.result.description}</Text>
                </View>
              </View>
            </View>

          }

          {
            this.state.noResult &&
            <View style={styles.no_result}>
              <Text style={styles.main_text}>Pokemon not found</Text>
              <Text style={styles.sub_text}>Please type the exact name</Text>
            </View>
          }

          {
            this.state.isLoading &&
            <View style={styles.loader}>
              <GiftedSpinner />
            </View>
          }
        </View>
      );
    },

    renderType: function(type){

      return (
        <View style={[styles[type.name], styles.type]}>
          <Text style={styles.type_text}>{type.name}</Text>
        </View>
      );

    },

    changeText: function(text){
      this.setState({
        query: text
      });
    },

    search: function(){
      var pokemon = _.capitalize(this.state.query);

      this.setState({
        isLoading: true
      });

      api(pokemon).then(
        (data) => {

          var speech = 'Pokemon was not found. Please type the exact name.';

          if(data.doc){
            var types = this.state.dataSource.cloneWithRows(data.doc.types);

            this.setState({
              hasResult: true,
              noResult: false,
              result: data.doc,
              types: types,
              isLoading: false
            });

            var type_names = _.map(data.doc.types, function(type){
               return type.name;
            });

            speech = data.doc.name + ". A " + type_names.join(' and ') + ' pokemon. ' + data.doc.description;

          }else{

            this.setState({
              hasResult: false,
              noResult: true,
              isLoading: false,
              result: null
            });

          }

          tts.speak({
            text: speech,
            forceStop : true ,
            language : 'en'
          });

        }
      );
});



var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  search: {
    flex: 1
  },
  result: {
    flex: 8
  },
  no_result: {
    flex: 8,
    alignItems: 'center'
  },
  loader: {
    flex: 1,
    alignItems: 'center'
  },
  main_details: {
    padding: 30,
    alignItems: 'center'
  },
  image_dimensions: {
    width: 100,
    height: 100
  },
  main_text: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  sub_text: {
    color: '#6e6e6e'
  },
  description: {
    marginTop: 20
  },
  text_input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1
  },
  types: {
    flexDirection: 'row',
    marginTop: 20
  },
  type: {
    padding: 5,
    width: 100,
    alignItems: 'center'
  },
  type_text: {
    color: '#fff',
  },
  normal: {
    backgroundColor: '#8a8a59'
  },
  fire: {
    backgroundColor: '#f08030'
  },
  water: {
    backgroundColor: '#6890f0'
  },
  electric: {
    backgroundColor: '#f8d030'
  },
  grass: {
    backgroundColor: '#78c850'
  },
  ice: {
    backgroundColor: '#98d8d8'
  },
  fighting: {
    backgroundColor: '#c03028'
  },
  poison: {
    backgroundColor: '#a040a0'
  },
  ground: {
    backgroundColor: '#e0c068'
  },
  flying: {
    backgroundColor: '#a890f0'
  },
  psychic: {
    backgroundColor: '#f85888'
  },
  bug: {
    backgroundColor: '#a8b820'
  },
  rock: {
    backgroundColor: '#b8a038'
  },
  ghost: {
    backgroundColor: '#705898'
  },
  dragon: {
    backgroundColor: '#7038f8'
  },
  dark: {
    backgroundColor: '#705848'
  },
  steel: {
    backgroundColor: '#b8b8d0'
  },
  fairy: {
    backgroundColor: '#e898e8'
  }
});

AppRegistry.registerComponent('Pokedex', () => Pokedex);
