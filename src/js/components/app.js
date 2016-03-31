/** @jsx React.DOM */
var React = require('react');
var AppActions = require('../actions/AppActions');
var AppStore = require('../stores/AppStore');


var CardMedia = React.createClass({
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
    //var coords = this.props.CapArea[defaultIdx].Coordinate.split(" ")[0];
    //var lon = coords.split(",")[0];
    //var lat = coords.split(",")[1];
    
    //lat = "59.315782";
    //lon = "18.033371";
    lat = this.props.position.split(",")[0];
    lon = this.props.position.split(",")[1];
    
    this.map.setView([lat, lon], zoom);
  },


  componentDidMount: function() {
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
    var self = this;
    navigator.geolocation.getCurrentPosition(
      (initialPosition) => this.setState({
        initialPosition
      }), (error) => alert(error.message), {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    );



    this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
      this.setState({
        lastPosition
      });
      var lat = Math.round(lastPosition.coords.latitude * 1000000) / 1000000;
      var lng = Math.round(lastPosition.coords.longitude * 1000000) / 1000000;
      var airApi = "//bamboo-zone-547.appspot.com/_ah/api/airup/v1/location/lat/" + lat + "/lng/" + lng + "";
      $.ajax({
        url: airApi,
        success: function(data) {
          console.log(data);
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
    
    console.log("lat: ", this.state);
    return (
      <div className="mdl-grid">
      <CardMedia position={posi} zoom="14" title="ZZZ" />
      {forcasts.map(function(entry){
        return <div className='mdl-card mdl-cell mdl-cell--4-col mdl-shadow--4dp'>
          <div className='mdl-card__title  mdl-color--blue mdl-color-text--white'>
            <strong>{entry.title}</strong><span>,&nbsp;</span><span>{entry.subtitle}</span>
          </div>
          <CardMedia position={entry.position} zoom="14" title={entry.title} position={entry.position}/>
          <div className="mdl-card__supporting-text">
          	<strong>Index: </strong>{entry.data.index}
          	
					</div>
				</div>
        })}
			</div>
    );
  }
});


module.exports = App;
