/** @jsx React.DOM */
var React = require('react');
var AppActions = require('../actions/AppActions');
var AppStore = require('../stores/AppStore');

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
      //var smhiAPI = "//crossorigin.me/http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/" + lat + "/lon/" + lon + "/data.json";
      $.ajax({
        url: airApi,
        success: function(data) {
          console.log(data);
          if (this.isMounted()) {
            this.setState({
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
    //console.log("F", forcasts);
    return (
      <div className="mdl-grid">
      {forcasts.map(function(entry){
        return <div className='mdl-card mdl-cell mdl-cell--4-col mdl-shadow--4dp'>
          <div className='mdl-card__title  mdl-color--blue mdl-color-text--white'>
            <h2 className='mdl-card__title-text'>{entry.title}</h2>
          </div>
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
