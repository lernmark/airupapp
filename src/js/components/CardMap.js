/** @jsx React.DOM */

var React = require('react');
var AppActions = require('../actions/AppActions');
var AppStore = require('../stores/AppStore');


var CardMap = React.createClass({
  displayName: "CardMap",
  createMap: function(element) {
    var map = L.map(element);
    L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    return map;
  },

  setupMap: function() {
    var defaultIdx = 0;
    var zoom = parseInt(this.props.zoom);
    var coords = this.props.position.split(" ")[0];
    var lon = coords.split(",")[1];
    var lat = coords.split(",")[0];
    console.log("Setup map: ", lat, lon);
    if (lat !== "undefined") {
      console.log(lat);
      this.map.setView([lat, lon], zoom);
    }
  },

  componentDidMount: function() {
    console.log("props: ", this.props.position.lat);
    if (this.props.createMap) {
      this.map = this.props.createMap(this.getDOMNode());
    }
    else {
      this.map = this.createMap(this.getDOMNode());
    }
    this.setupMap();
  },
  render: function() {
    return (<div className="map mdl-card__media">
              </div>)
  }
});

var App = React.createClass({

  getInitialState: function() {
    return {
      forcasts: [],
      pImage: []
    };
  },

  componentDidMount: function() {
    this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
      this.setState({
        lastPosition
      });
      var lat = Math.round(lastPosition.coords.latitude * 1000000) / 1000000;
      var lng = Math.round(lastPosition.coords.longitude * 1000000) / 1000000;
      //lat = "59.315782";
      //lng = "16.033371";

      var airApi = "https://bamboo-zone-547.appspot.com/_ah/api/airup/v1/location/lat/" + lat + "/lng/" + lng + "";
      $.ajax({
        url: airApi,
        success: function(data) {
          console.log("ajax data", data);
          if (this.isMounted()) {
            this.setState({
              lat:lat,
              lng:lng,
              forcasts: data.zones
            });
          }
        }.bind(this),
      });
    });

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
    $.get(this.props.source, function(result) {
      var collection = result.Entries;
      if (this.isMounted()) {
        this.setState({
          pImage: collection
        });
      }
    }.bind(this));
  },

  handleClick: function() {
    AppActions.addItem('this is the item');
  },

  render: function() {
    var msbEntries = this.state.pImage || [];
    var forcasts = this.state.forcasts || [];
    var lat = this.state.lat;
    var lng = this.state.lng;
    var posi = lat + "," + lng;
    var title = "No air quality data available";

    console.log("lat lng: ", posi, forcasts);
    if (forcasts.length > 0) {
    return (
      <div className="mdl-grid">

      {forcasts.map(function(entry){
        return <div className='mdl-card mdl-cell mdl-cell--6-col mdl-cell--1-offset-tablet mdl-cell--3-offset-desktop'>
          <div className='mdl-card__title mdl-color-text--blue-grey '>
            <strong>{entry.title}</strong><span>,&nbsp;</span><span>{entry.subtitle}</span>
          </div>
          <CardMap position={posi} zoom="14" title={entry.title}/>
          <div className="mdl-card__supporting-text">
          	<strong>Index: </strong>{entry.data.index}<br/>
          	<strong>Position: </strong>{posi}
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
          <CardMap position={posi} zoom="14" title={title}/>
          <div className="mdl-card__supporting-text">


					</div>
				</div>
    );

  }
  }
});


module.exports = App;
