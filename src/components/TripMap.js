import React, { Component } from 'react';
// import {Map, Marker} from 'google-maps-react';
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

    const tripArray = [...this.props.location.tripArray]
    this.setState({
      tripArray
    })
  }
  submitForm(e){
    console.log("PRESS ENTER")
    e.preventDefault();

  }
  componentDidMount(){
    console.log('WILL MOUNT', this.state.tripArray);
    if(this.props.location.place.geometry){
        this.onPlaceChanged()
    }

  }
  onPlaceChanged(place){
    console.log('staeaelknealeanaf', this.state.tripArray)
    const {google} = this.props;
    const refMap = this.refMap;
    var waypointsArr = [];
    var originArr = [];
    var destinationArr = [];
    var latlng = new google.maps.LatLng(42.39, -72.52);
    var countries = {
    'us': {
      center: latlng,
      zoom: 14
    },
    };


    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    this.setState({
      map: new google.maps.Map(refMap, {
      zoom: countries['us'].zoom,
      center: countries['us'].center
      })
    }, function(){
      if(this.state.map){
        this.state.map.panTo(this.state.tripArray[0].location);
      }
      if(this.state.tripArray.length > 1) {

        //ADD MARKERS FOR DISTANCE ON MAP
        this.state.tripArray.map(function(waypoints, index){
          if(index > 0 && index < this.state.tripArray.length-1){
            const waypointsLocations = {
              location: waypoints.city
            }

            waypointsArr.push({...waypointsLocations})
            console.log("WAY ARRAYdadwadwaw", waypointsArr)
          }
          var origin1 = {lat: 55.93, lng: -3.118};
          var origin2 = 'Greenwich, England';
          var destinationA = 'Stockholm, Sweden';
          var destinationB = {lat: 50.087, lng: 14.421};
          originArr.push(waypoints.location);
          destinationArr.push(waypoints.city);

        }.bind(this))
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
          var service = new google.maps.DistanceMatrixService;
                   service.getDistanceMatrix({
                     origins: originArr,
                     destinations: destinationArr,
                     travelMode: 'DRIVING',
                     unitSystem: google.maps.UnitSystem.METRIC,
                     avoidHighways: false,
                     avoidTolls: false
                   }, function(response, status) {
                     if (status !== 'OK') {
                       alert('Error was: ' + status);
                     } else {
                       console.log('RESPONSEEEEEEE', response)
                     };
                   });

      }
    })
    // this.state.map = new google.maps.Map(refMap, {
    // zoom: countries['us'].zoom,
    // center: countries['us'].center
    // })


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
    e.preventDefault();

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
              newCity: '',
              openSearch: false
            })
            console.log("THIS NEW PUSH", this.state.tripArray)
            this.onPlaceChanged(place);
          }
    }.bind(this))


  }
  deleteTrip(trip){
    console.log('HELFMALFNKKLAFNAEF', trip)
    const tripList = [...this.state.tripArray];
    const deleteTrip = tripList.filter((removeTrip) => removeTrip.id !== trip.id)
    this.setState({
      tripArray: deleteTrip
    }, this.onPlaceChanged.bind(this))

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
            {this.state.tripArray ? (
              this.state.tripArray.map((trip) => {
                return (
                  <div key={trip.id} className="tripDetails" ref={ref => this.tripDetails = ref}>
                    <div className="tripTopContainer">
                      <div className="tripTopLeftContainer">
                          <h2 className="tripDetailsTitle">{trip.city}</h2>
                      </div>
                      <div className="tripTopRightContainer">
                        <button id="eraserButton" value={trip} onClick={() => this.deleteTrip(trip)}>
                            <i id="eraserIcon" className="fa fa-pencil" ></i>
                        </button>
                        <button id="eraserButton" value={trip} onClick={() => this.deleteTrip(trip)}>
                            <i id="eraserIcon" className="fa fa-trash" ></i>
                        </button>

                      </div>
                    </div>

                    <img src={trip.image} alt="boohoo" className="img-responsive"/>
                  </div>
                )
              })
            ): <div>Loading</div>}

            {this.state.openSearch === false ?   <button type="button" className="addTripButton" onClick={() => this.addTrip()}>+</button> :
              <div className="newInputTrip">
              <form onSubmit={this.submitForm.bind(this)}>
                <input type="text" className="inputNewTrip" value={this.state.value} placeholder="Start your journey" ref={ref => this.newInput = ref} onChange={this.handleChange} />
                </form>
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
