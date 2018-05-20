import React, { Component } from 'react';
import {Map, Marker} from 'google-maps-react';
import '../styles/TripMap.css';

class TripMap extends Component {
  constructor(props){
    super(props);
    this.state = {
      map: '',
      openSearch: false,
      secondDestination: ''
    }
    this.onPlaceChanged = this.onPlaceChanged.bind(this);
    this.addTrip = this.addTrip.bind(this);

  }
  componentDidMount(){
    if(this.props.props.location.place.geometry){
        this.onPlaceChanged();
    }

  }
  onPlaceChanged(){
    console.log("ON PLACE FIRES", this.state.secondDestination)
    const {google} = this.props;
    const refMap = this.refMap;
    var latlng = new google.maps.LatLng(42.39, -72.52);
    // console.log('REF MAP', this.refMap)
    var countries = {
    'us': {
      center: latlng,
      zoom: 14
    },
    };
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    this.state.map = new google.maps.Map(refMap, {
    zoom: countries['us'].zoom,
    center: countries['us'].center
    })
    if(this.state.secondDestination.length <= 1){
      this.state.map.panTo(this.props.props.location.place.geometry.location);
      console.log("THIS FIRES FIRST", this.state.secondDestination)
    }
    if(this.state.secondDestination.length > 1) {
      console.log('FIRE AWAY')
      directionsDisplay.setMap(this.state.map);
        // this.state.map.setZoom;
        directionsService.route({
          origin: this.props.props.location.place.geometry.location,
          destination: this.state.secondDestination,
          waypoints: [],
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
    }

  }
  addTrip(){
    console.log('ADD TRIP HAS BEEN CLICKED');
    this.setState({
      openSearch: true,
      secondDestination: 'Oklahoma City, OK'
    }, function(){
      if(this.state.secondDestination){
        this.onPlaceChanged();
      }

    })


  }
  render(){
    const style = {
      width: '100%',
      height: '100%'
    }
    return(!this.props.props.location ? (<div>Loading</div>) : (

        <div className="MainMap">
          <div className="MapLeftContainer">
            <div className="MapLeftContainerHeader">
              <h2 className="MapLeftContainerTitle">Your Trips</h2>
            </div>
            <div className="tripDetails" ref={ref => this.tripDetails = ref}>
              <h2 className="tripDetailsTitle">{this.props.props.location.place.formatted_address}</h2>
              <img src={this.props.props.location.place.photos[0].getUrl({'maxWidth': 300, 'maxHeight': 200})} alt="boohoo" className="img-responsive"/>
            </div>
            {this.state.openSearch === false ?   <button type="button" className="addTripButton" onClick={() => this.addTrip()}>+</button> :
              <div className="newInputTrip">
                <input type="text" className="inputNewTrip" value={this.state.value} placeholder="Start your journey" ref={ref => this.test = ref} onChange={this.handleChange} />
              </div>
            }
          </div>
          <div className="MapRightContainer">
            <div style={style} ref={ref => this.refMap = ref}>
              <div  />
            </div>
        </div>
      </div>
      )
    )

  }
}



// <Marker
// title={'The marker`s title will appear as a tooltip.'}
// name={'SOMA'}
// position={{lat: 34.0522, lng: -118.2437}} />

export default TripMap
