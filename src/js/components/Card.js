/** @jsx React.DOM */

var React = require('react');
var AppActions = require('../actions/AppActions');
var AppStore = require('../stores/AppStore');
var map;

var Card = React.createClass({
  displayName: "Card",
  createMap: function(element) {
    var map = L.map(element);
    L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    return map;
  },

  /*
  setupMap
  Tar parameterdata från zoom och position i markup-koden.
  */
  setupMap: function(map) {
    var defaultIdx = 0;
    var zoom = parseInt(this.props.zoom);
    var stations = this.props.stations;
    var coords = this.props.position.split(" ")[0];
    var lon = coords.split(",")[1];
    var lat = coords.split(",")[0];
    console.log("Card: Setup map: ", map);

    for (s in stations) {
      var station = stations[s];
      console.log(station);
      var slon = parseFloat(station.position.split(",")[1]);
      var slat = parseFloat(station.position.split(",")[0]);
      L.marker([slat,slon]).addTo(map)
          .bindPopup(station.sourceId)
          .openPopup();
    }

    if (lat !== "undefined") {
      //console.log(lat);
      this.map.setView([lat, lon], zoom);
    }
  },

  componentDidMount: function() {
    console.log("Card: componentDidMount props: ", this.props.position.lat);
    if (this.props.createMap) {
      this.map = this.props.createMap(this.getDOMNode());
    }
    else {
      this.map = this.createMap(this.getDOMNode());
    }
    this.setupMap(this.map);
  },
  render: function() {
    return (<div className="map mdl-card__media">
              </div>)
  }
});

var App = React.createClass({

  getInitialState: function() {
    return {
      allCards: [],
      type: "",
    };
  },

  componentDidMount: function() {
    console.log("Card: componentDidMount this.props.card:", this.props.card);
    // this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
    //   this.setState({
    //     lastPosition
    //   });
    //   var lat = Math.round(lastPosition.coords.latitude * 1000000) / 1000000;
    //   var lng = Math.round(lastPosition.coords.longitude * 1000000) / 1000000;

      console.log("Card: navigator... ",lat,lng);
      var lat = "";
      var lng = "";
      var title = this.props.card.titile;
      var text = this.props.card.text;
      var type = this.props.card.type;

      if (type === "info") {
        this.setState({
          type:type,
        });
      } else if (type === "map") {
        var lat = this.props.card.coords.split(",")[0];
        var lng = this.props.card.coords.split(",")[1];


        var airApi = "https://airupdata.appspot.com/_ah/api/airup/v1/location/lat/" + lat + "/lng/" + lng + "";
        $.ajax({
          url: airApi,
          success: function(data) {
            console.log("Card: ajax data from airup", data);
            if (this.isMounted()) {
              this.setState({
                lat:lat,
                lng:lng,
                type:type,
                allCards: data.zones
              });
            }
          }.bind(this),
        });
      }

    // });

/*
    this.watchID = navigator.geolocation.watchPosition(function (lastPosition) {
      this.setState({
        lastPosition: lastPosition
      });
      var lat = Math.round(lastPosition.coords.latitude * 1000000) / 1000000;
      var lng = Math.round(lastPosition.coords.longitude * 1000000) / 1000000;
      var airApi = "//bamboo-zone-547.appspot.com/_ah/api/airup/v1/location/lat/" + lat + "/lng/" + lng + "";
      $.ajax({
        url: airApi,
        success: function (data) {
          console.log("data",data);
          if (this.isMounted()) {
            this.setState({
              lat: lat,
              lng: lng,
              forcasts: data.zones
            });
          }
        }.bind(this)
      });
    });
*/
    //https://bamboo-zone-547.appspot.com/_ah/api/airup/v1/location/lat/59.315782/lng/18.033371
    // $.get(this.props.source, function(result) {
    //   var collection = result.Entries;
    //   if (this.isMounted()) {
    //     this.setState({
    //       pImage: collection
    //     });
    //   }
    // }.bind(this));
  },

  removeCard:function(id){
    console.log("Navigation: removeCard: ", id, e);
    AppActions.removeCard(id);
    //AppActions.insertMapCard('59.315219,18.034122', 'Hornstull, Stockholm')
    //AppActions.insertMapCard('59.313215,18.081075', 'SOFO, Stockholm')
    //AppActions.insertMapCard('52.481409,13.434372', 'Neukölln, Berlin')
  },

  render: function() {
    var allCards = this.state.allCards || [];
    var lat = this.state.lat;
    var lng = this.state.lng;
    var type = this.state.type;
    var posi = lat + "," + lng;
    var title = "No air quality data available";

    console.log("ZZZZZZ Card: TYPE: ", this.state);
    if (type === "") {
      return (
        <span></span>
      );
    } else if (type === "info") {
      return (
          <div className='mdl-card mdl-cell mdl-cell--6-col mdl-cell--1-offset-tablet mdl-cell--3-offset-desktop'>
            <div className='mdl-card__title mdl-color-text--blue-grey'>
              <strong>Airup, what is it?</strong>
            </div>

            <div className="mdl-card__supporting-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.            </div>
          </div>
      );

    } else if (type === "map") {
      if (allCards.length > 0) {
        return (
          <div className="mdl-grid">

          {allCards.map(function(entry){
            console.log("EEEEE", entry);
            return <div className='mdl-card mdl-cell mdl-cell--6-col mdl-cell--1-offset-tablet mdl-cell--3-offset-desktop'>
              <div className="mdl-card__menu">
                <button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                  <i className="material-icons">close</i>
                </button>
              </div>
              <div className='mdl-card__title mdl-color-text--blue-grey '>
                <strong>{entry.title}</strong><span>,&nbsp;</span><span>{entry.subtitle}</span>
              </div>

              <Card position={posi} zoom="14" title={entry.title} stations={entry.stations}/>
              <div className="mdl-card__supporting-text">
                <strong>Index: </strong>{entry.data.index}<br/>

              </div>
            </div>
            })}
          </div>
        );
      } else {
        return (
            <div className='mdl-card mdl-cell mdl-cell--6-col mdl-cell--1-offset-tablet mdl-cell--3-offset-desktop'>
              <div className='mdl-card__title mdl-color-text--blue-grey'>
                <strong>No air quality data available</strong>
              </div>
              <Card position={posi} zoom="14" title={title}/>
              <div className="mdl-card__supporting-text">


              </div>
            </div>
        );
      }
    } else if (type === "info") {

    } else {

    }


  }
});


module.exports = App;
