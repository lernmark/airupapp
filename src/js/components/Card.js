/** @jsx React.DOM */

var React = require('react');
var AppActions = require('../actions/AppActions');
var AppStore = require('../stores/AppStore');
var map;
var formDataObj = {
  'fullname':'',
  'email':'',
  'neighbourhood':''
};

var aqiLabel = function(aqi) {
  var tempValue = "Good";
  switch (true) {
    case (aqi<50):
      tempValue = "Good";
      break;
    case (aqi<100):
      tempValue = "Moderate";
      break;
    case (aqi<150):
      tempValue = "Unhealthy for sensitive groups";
      break;
    case (aqi<200):
      tempValue = "Unhealthy";
      break;
    case (aqi<300):
      tempValue = "Very unhealthy";
      break;
    default:
      tempValue = "Hazardous";
  }
  return tempValue;
};

var MapCard = React.createClass({
  displayName: "MapCard",
  removeCard:function(coords, e){
    AppActions.removeCard(coords);
  },



  render: function() {
    return (
      <div className='mdl-card mdl-cell mdl-cell--12-col'>
        <div className='mdl-card__title mdl-color-text--blue-grey-800'>
          <h6><strong>{this.props.title}</strong><span>,&nbsp;</span><span>{this.props.subtitle}</span></h6>
        </div>
        <div className="mdl-card__supporting-text" >
        <strong>Index: </strong>{Math.round(this.props.airData.index)} <em>({aqiLabel(this.props.airData.index)})</em>

        </div>
        <Card position={this.props.position} zoom="5" title={this.props.title} subtitle={this.props.subtitle} airData={this.props.data} stations={this.props.stations}/>
        <div className="mdl-card__menu">
          <button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect mdl-color-text--grey-400" onClick={this.removeCard.bind(this, this.props.position)}>
            <i className="material-icons">close</i>
          </button>
        </div>
      </div>
    )
  }
});

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
    var airData = this.props.airData;
    var coords = this.props.position.split(" ")[0];
    var lon = coords.split(",")[1];
    var lat = coords.split(",")[0];

    var apiUrl = "https://airupdata.appspot.com/_ah/api/airup/v1/rawdata";
    //var apiUrl = "//localhost:8080/_ah/api/airup/v1/rawdata?offset=0";

    loadRawData(apiUrl + "?offset=0");
    loadRawData(apiUrl + "?offset=1");
    loadRawData(apiUrl + "?offset=2");
    loadRawData(apiUrl + "?offset=3");

    function getColor(index) {
      var color = "";
      if (index > 40) {
        color = "red";
      } else if(index > 30) {
        color = "pink"
      } else if(index > 20) {
        color = "yellow"
      } else {
        color = "green";
      }
      return color;
    }
    
    function loadRawData(apiUrl) {
      $(".mdl-progress").show();
      $.getJSON( apiUrl, function( data ) {
        var items = [];

        $.each( data.records, function( key, station ) {

        //   items.push( "<li id='" + key + "'>" + val + "</li>" );
          //$(".mdl-progress").show();
          var slon = parseFloat(station.position.split(",")[1]);
          var slat = parseFloat(station.position.split(",")[0]);

          //console.log(slon, slat, station.sourceId);
          L.circle([(Math.round(slat * 100)/100),(Math.round(slon * 100)/100)], 500, {
              color: getColor(station.index),
              fillColor: getColor(station.index),
              fillOpacity: 0.3
          }).addTo(map).bindPopup(station.positionLabels + "<br/>Air quality index: <strong>" + station.index + "</strong>").openPopup();


        });
      }).done(function() {
        console.log( "second success" );
        $(".mdl-progress").hide();
        if (lat !== "undefined") {
          map.setView([lat, lon], zoom);
        }        
      })
      .fail(function() {
        console.log( "error" );
        $(".mdl-progress").hide();
      });
    }


    for (s in stations) {
      var station = stations[s];
      console.log(station);
      var slon = parseFloat(station.position.split(",")[1]);
      var slat = parseFloat(station.position.split(",")[0]);

      L.circle([(Math.round(slat * 100)/100),(Math.round(slon * 100)/100)], 500, {
          color: getColor(station.index),
          fillColor: getColor(station.index),
          fillOpacity: 0.3
      }).addTo(map);      
      
    }

    if (lat !== "undefined") {
      this.map.setView([lat, lon], zoom);
    }
  },

  componentDidMount: function() {
    if (this.props.createMap) {
      this.map = this.props.createMap(this.getDOMNode());
    }
    else {
      this.map = this.createMap(this.getDOMNode());
    }
    this.setupMap(this.map);
  },
  render: function() {
    return (
        <div className="map mdl-card__media"></div>
    )
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

      var lat = "";
      var lng = "";
      var title = this.props.card.title;
      var text = this.props.card.text;
      var type = this.props.card.type;

      if (type === "info") {
        this.setState({
          type:type,
          title:title,
          text:text
        });
      } else if (type === "map") {
        var lat = this.props.card.coords.split(",")[0];
        var lng = this.props.card.coords.split(",")[1];
        $(".mdl-progress").show();
        var airApi = "https://airupdata.appspot.com/_ah/api/airup/v1/location/lat/" + lat + "/lng/" + lng + "";
        $.ajax({
          url: airApi,
          success: function(data) {
            if (this.isMounted()) {
              $(".mdl-progress").hide();
              this.setState({
                lat:lat,
                lng:lng,
                type:type,
                title:title,
                text:text,
                allCards: data.zones
              });
            }
          }.bind(this),
        });
      }
  },
  handleChange: function(event) {
    formDataObj[event.target.id] = event.target.value;
    if (formDataObj.neighbourhood === "") {
      $("#form-submit").attr('disabled', 'disabled');

    } else {
      $("#form-submit").removeAttr('disabled');
    }
    this.setState({formdata: formDataObj});
  },

  handleSave: function(event) {


    if (formDataObj.neighbourhood === "") {

      console.log("Enter values in all fields.");
    } else {
      AppActions.submitSignup(this.state.formdata);
      // $(".mdl-progress").show();
      // $.post( "/signup", this.state.formdata).done(function( data ) {
      //   $(".mdl-progress").hide();
      //   $("#form-ok").show();
      // });
    }

  },

  render: function() {
    var type = this.state.type;
    var title = this.state.title;
    var text = this.state.text;

                var progressWidth = {

                  width: '60%' // 'ms' is the only lowercase vendor prefix
                };

    if (type === "") {
      return (
        <span></span>
      );
    } else if (type === "info") {
      return (
        <div className='mdl-card mdl-cell mdl-cell--6-col'>
          <div className='mdl-card__title mdl-color-text--blue-grey'>
            <strong>What is the air quality like where I live?</strong>
          </div>
          <div className="mdl-card__supporting-text">
            {text}
          </div>
          <div className="mdl-card__supporting-text">
            <form action="#">
            <div className="mdl-textfield mdl-js-textfield">
              <input className="mdl-textfield__input" type="text" value={this.state.neighbourhood} onChange={this.handleChange} id="neighbourhood" required/>
              <label className="mdl-textfield__label" for="neighbourhood">My neighbourhood</label>
            </div>
              <div className="mdl-textfield mdl-js-textfield">
                <input className="mdl-textfield__input" type="text" value={this.state.fullname} onChange={this.handleChange} id="fullname" />
                <label className="mdl-textfield__label" for="fullname">Name</label>
              </div>
              <div className="mdl-textfield mdl-js-textfield">
                <input className="mdl-textfield__input" type="email" value={this.state.email} onChange={this.handleChange} id="email" />
                <label className="mdl-textfield__label" for="email">Email</label>
              </div>
            </form>
          </div>
          <div className="mdl-card__actions mdl-card--border">
            <a className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised" id="form-submit" onClick={this.handleSave} disabled>
              Submit
            </a>
            <div className="progress-container">
              <div id="progress" className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
            </div>
            <p className="form-message" id="form-ok">
              <code >Ok, We will keep you posted</code>
            </p>
          </div>
        </div>
      );

    } else if (type === "map") {
      var allCards = this.state.allCards || [];
      var lat = this.state.lat;
      var lng = this.state.lng;
      var posi = lat + "," + lng;

      if (allCards.length > 0) {
        return (

          <div className="mdl-grid">
            {/*<p className="progress-container">
              <div id="progress" className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
            </p>*/}
            {allCards.map(function(entry){
              return <MapCard position={posi} zoom="10" title={entry.title} subtitle={entry.subtitle} airData={entry.data} stations={entry.stations}/>
            })}
          </div>
        );
      } else {
        return (
            <div className='mdl-card mdl-cell mdl-cell--6-col'>
              <div className='mdl-card__title mdl-color-text--blue-grey'>
                <strong>No air quality data available</strong>
              </div>

              <div className="mdl-card__supporting-text">


              </div>
            </div>
        );
      }
    }


  }
});


module.exports = App;
