import React, { Component } from 'react';
import {Map, Marker} from 'google-maps-react';
import '../styles/TripMap.css';

class TripMap extends Component {
  constructor(props){
    super(props);
    this.state = {
      map: '',
      openSearch: false,
      secondDestination: '',
      city: '',
      tripArray: []
    }
    this.onPlaceChanged = this.onPlaceChanged.bind(this);
    this.addTrip = this.addTrip.bind(this);
    this.newInputTrip = this.newInputTrip.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }
  componentWillMount(){
    console.log('WILL MOUNT', this.props, this.state);
    const tripArray = [...this.props.location.tripArray]
    this.setState({
      tripArray
    })
  }
  componentDidMount(){
    if(this.props.location.place.geometry){
        this.onPlaceChanged()
    }

  }
  onPlaceChanged(place){
    console.log('staeaelknealeanaf', this.state.tripArray)
    const {google} = this.props;
    const refMap = this.refMap;
    var waypointsArr = [];
    var latlng = new google.maps.LatLng(42.39, -72.52);
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
    if(!place){
      this.state.map.panTo(this.props.location.tripArray[0].location);
    }
    if(this.state.tripArray.length > 1) {
      this.state.tripArray.map(function(waypoints, index){
        if(index > 0 && index < this.state.tripArray.length-1){
          console.log("THIS WORKS IN WAY POINTS", waypoints)
          const waypointsLocations = {
            location: waypoints.city
          }

          waypointsArr.push({...waypointsLocations})
          console.log("WAY ARRAYdadwadwaw", waypointsArr)
        }
      }.bind(this))
      console.log('FIRE AWAY')
      directionsDisplay.setMap(this.state.map);
        // this.state.map.setZoom;
        directionsService.route({
          origin: this.props.location.place.geometry.location,
          destination: this.state.tripArray[this.state.tripArray.length-1].city,
          waypoints: [...waypointsArr],
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
      openSearch: true
    })
    // this.setState({
    //   openSearch: true,
    //   secondDestination: 'Oklahoma City, OK'
    // }, function(){
    //   if(this.state.secondDestination){
    //     this.onPlaceChanged();
    //   }
    //
    // })


  }
  handleChange(e){
    var value = e.target.value;
    console.log('VALUE', value)
    this.setState({
      newCity: value
    })
    this.newInputTrip(value)

  }
  newInputTrip(value){
    console.log('THIS STATE NEW INPUT', this.state.tripArray)
    var input = this.newInput;
    const {google} = this.props;
    var options = {
      types: ['(cities)'],
      componentRestrictions: {country: 'us'}
    };

    this.state.autocomplete = new google.maps.places.Autocomplete(input, options);
    var finalAutoComplete = this.state.autocomplete;
    this.state.autocomplete.addListener("place_changed", function(){
        var place = finalAutoComplete.getPlace();
          // console.log('HANDLE STATE OF AUTO', place)
          if(place){

            console.log("WHAT IS THIS PLACE", place.formatted_address)
            const city = {
              city: place.formatted_address,
              image: place.photos[0].getUrl({'maxWidth': 300, 'maxHeight': 200}),
              id: place.id,
              location: place.geometry.location
            }
            const tripArray = [...this.state.tripArray];

            tripArray.push({...city})
            this.setState({
              tripArray,
              newCity: ''
            })
            console.log("THIS NEW PUSH", this.state.tripArray)
            this.onPlaceChanged(place);
          }
    }.bind(this))


  }

  render(){
    const style = {
      width: '100%',
      height: '100%'
    }
    return(!this.props.location ? (<div>Loading</div>) : (

        <div className="MainMap">
          <div className="MapLeftContainer">
            <div className="MapLeftContainerHeader">
              <h2 className="MapLeftContainerTitle">Your Trips</h2>
            </div>
            <div className="tripDetails" ref={ref => this.tripDetails = ref}>
              <h2 className="tripDetailsTitle">{this.props.location.tripArray[0].city}</h2>
              <img src={this.props.location.tripArray[0].image} alt="boohoo" className="img-responsive"/>
            </div>
            {this.state.openSearch === false ?   <button type="button" className="addTripButton" onClick={() => this.addTrip()}>+</button> :
              <div className="newInputTrip">
                <input type="text" className="inputNewTrip" value={this.state.value} placeholder="Start your journey" ref={ref => this.newInput = ref} onChange={this.handleChange} />
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
