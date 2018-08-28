import React, { Component } from "react";
// import {Map, Marker} from 'google-maps-react';
import "../styles/TripMap.css";

class TripMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: "",
      openSearch: false,
      secondDestination: "",
      city: "",
      tripArray: [],
      distanceArray: [],
      totalDistance: 0,
      totalTime: 0,
      showInput: true,
      lastDelete: false
    };
    this.onPlaceChanged = this.onPlaceChanged.bind(this);
    this.addTrip = this.addTrip.bind(this);
    this.newInputTrip = this.newInputTrip.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentWillMount() {
    if (this.props.location.tripArray) {
      const tripArray = [...this.props.location.tripArray];
      this.setState({
        tripArray
      });
    }
  }
  submitForm(e) {
    e.preventDefault();
  }
  componentDidMount() {
    if (this.props.location.place) {
      this.onPlaceChanged();
    } else {
      this.onPlaceChanged();
    }
  }
  componentDidUpdate() {
    if (this.state.distanceArray.length > 1) {
    }
  }
  onPlaceChanged(place) {
    const { google } = this.props;
    const refMap = this.refMap;
    var waypointsArr = [];
    var originArr = [];
    var destinationArr = [];
    var latlng = new google.maps.LatLng(37.7749, -122.4194);
    var countries = {
      us: {
        center: latlng,
        zoom: 14
      }
    };
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    this.setState(
      {
        map: new google.maps.Map(refMap, {
          zoom: countries["us"].zoom,
          center: countries["us"].center
        })
      },
      function() {
        if (this.state.tripArray.length === 0) {
          this.state.map;
        }
        if (this.state.map && this.state.tripArray.length === 1) {
          this.state.map.setZoom(16);
          this.state.map.panTo(this.state.tripArray[0].location);

          this.setState({
            openSearch: false
          });
        }
        //CHECK IF MORE THAN TWO TRIPS ARE IN TRIP ARRAY
        if (this.state.tripArray.length > 0) {
          //ADD MARKERS FOR DISTANCE ON MAP
          this.state.tripArray.map(
            function(waypoints, index) {
              if (index > 0 && index < this.state.tripArray.length - 1) {
                const waypointsLocations = {
                  location: waypoints.city
                };

                waypointsArr.push({ ...waypointsLocations });
              }
              //ADD LOCATION(LAT AND LONG) TO THE ORIGIN ARRAY, ADD CITIES FROM TRIP ARRAY TO DESTINATION ARRAY
              originArr.push(waypoints.location);
              destinationArr.push(waypoints.city);
            }.bind(this)
          );
          directionsDisplay.setMap(this.state.map);
          directionsService.route(
            {
              origin: this.props.location.place
                ? this.props.location.place.geometry.location
                : this.state.tripArray[0].location,
              destination: this.state.tripArray[this.state.tripArray.length - 1]
                .city,
              waypoints: [...waypointsArr],
              travelMode: "DRIVING"
            },
            function(response, status) {
              if (status === "OK") {
                directionsDisplay.setDirections(response);
              } else {
                window.alert("Directions request failed due to " + status);
              }
            }.bind(this)
          );

          var service = new google.maps.DistanceMatrixService();
          service.getDistanceMatrix(
            {
              origins: originArr,
              destinations: destinationArr,
              travelMode: "DRIVING",
              unitSystem: google.maps.UnitSystem.IMPERIAL,
              avoidHighways: false,
              avoidTolls: false
            },
            function(response, status) {
              if (status !== "OK") {
                alert("Error was: " + status);
              } else {
                //  const finalTripArr = [...this.state.tripArray]
                const distanceRows = response.rows;
                var totalDistance = 0;
                var totalTime = 0;
                var mins = "";
                var hours = "";
                distanceRows.map((distance, i) => {
                  if (i < distanceRows.length - 1) {
                    return distance.elements.map((trip, index) => {
                      if (i === index - 1) {
                        totalTime = trip.duration.value / 60 + totalTime;
                        totalDistance =
                          parseInt(trip.distance.text.replace(/,/g, "")) +
                          totalDistance;
                      }
                    });
                  }
                });
                if (totalTime % 60 !== 0) {
                  mins = Math.floor((totalTime % 60).toString());
                  hours = Math.floor(totalTime / 60).toString();
                  totalTime = hours + " h " + mins + " min";
                }
                this.setState({
                  distanceArray: distanceRows,
                  openSearch: false,
                  totalDistance,
                  totalTime
                });
              }
            }.bind(this)
          );
        }
      }
    );
  }
  addTrip() {
    this.setState({
      openSearch: true
    });
  }
  handleChange(e) {
    var value = e.target.value;
    this.setState({
      newCity: value
    });
    this.newInputTrip(value);
  }
  newInputTrip(value) {
    var input = this.newInput;
    const { google } = this.props;
    var options = {
      types: ["(cities)"],
      componentRestrictions: { country: "us" }
    };
    const tripArray = [...this.state.tripArray];
    if (tripArray.length < 6) {
      this.setState(
        {
          autocomplete: new google.maps.places.Autocomplete(input, options)
        },
        function() {
          var finalAutoComplete = this.state.autocomplete;
          this.state.autocomplete.addListener(
            "place_changed",
            function() {
              var place = finalAutoComplete.getPlace();
              if (place) {
                var image = "";
                if (place.photos) {
                  image = place.photos[0].getUrl({
                    maxWidth: 250,
                    maxHeight: 150
                  });
                }
                const city = {
                  city: place.formatted_address,
                  image: image,
                  id: place.id,
                  location: place.geometry.location
                };

                tripArray.push({ ...city });
                this.setState({
                  tripArray,
                  newCity: ""
                });
                this.onPlaceChanged(place);
              }
            }.bind(this)
          );
        }
      );
    } else {
      this.setState({
        showInput: false
      });
    }
  }
  deleteTrip(trip) {
    const tripList = [...this.state.tripArray];
    const deleteTrip = tripList.filter(removeTrip => removeTrip.id !== trip.id);
    this.setState(
      {
        tripArray: deleteTrip,
        showInput: true
      },
      function() {
        if (this.state.tripArray.length >= 0) {
          this.onPlaceChanged();
        }
      }.bind(this)
    );
  }

  render() {
    const style = {
      width: "100%",
      height: "100%"
    };
    return !this.props.location ? (
      <div>Loading</div>
    ) : (
      <div className="MainMap">
        <div className="MapLeftContainer">
          <div className="MapLeftContainerHeader">
            <div className="HeaderTitle">
              <h2 className="MapLeftContainerTitle">Your Trips</h2>
            </div>
            {this.state.distanceArray.length > 1 ? (
              <div className="HeaderTripDetails">
                <div className="TripsTitle">
                  <h4 className="DetailTitle">Trips</h4>
                  <h4 className="DetailDescripton">
                    {this.state.distanceArray.length}
                  </h4>
                </div>
                <div className="DurationTitle">
                  <h4 className="DetailTitle">Distance</h4>
                  <h4 className="DetailDescripton">
                    {this.state.totalDistance} miles
                  </h4>
                </div>
                <div className="DurationTitle">
                  <h4 className="DetailTitle">Duration</h4>
                  <h4 className="DetailDescripton">{this.state.totalTime}</h4>
                </div>
              </div>
            ) : null}
          </div>
          <div className="MapLeftSubContainer">
            <div className="MapLeftCities">
              {this.state.showInput ? (
                <div>
                  {this.state.openSearch === false ? (
                    <button
                      type="button"
                      className="addTripButton"
                      onClick={() => this.addTrip()}
                    >
                      +
                    </button>
                  ) : (
                    <div className="newInputTrip">
                      <form onSubmit={this.submitForm.bind(this)}>
                        <input
                          type="text"
                          className="inputNewTrip"
                          value={this.state.value}
                          placeholder="Start your journey"
                          ref={ref => (this.newInput = ref)}
                          onChange={this.handleChange}
                        />
                      </form>
                    </div>
                  )}
                </div>
              ) : (
                <div className="addTripLimit">
                  <h5 className="addTripLimitTitle">
                    Maximum Trips Allowed Is 5
                  </h5>
                </div>
              )}

              {this.state.tripArray ? (
                <div>
                  {this.state.tripArray.map((trip, index) => {
                    return (
                      <div className="TripRow" key={trip.id}>
                        <div className="TripCount">
                          <h4 className="TripCountCircle">{index + 1}</h4>
                        </div>
                        <div
                          key={trip.id}
                          className="tripDetails"
                          ref={ref => (this.tripDetails = ref)}
                        >
                          <div className="tripTopContainer">
                            <div className="tripTopLeftContainer">
                              <h2 className="tripDetailsTitle">{trip.city}</h2>
                            </div>
                            <div className="tripTopRightContainer">
                              <button
                                id="eraserButton"
                                value={trip}
                                onClick={() => this.deleteTrip(trip)}
                              >
                                <i id="eraserIcon" className="fa fa-trash" />
                              </button>
                            </div>
                          </div>

                          <img
                            src={trip.image}
                            alt="No Image Available"
                            className="img-responsive"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div>Loading</div>
              )}
            </div>
            <div className="MapLeftDistances">
              {this.state.distanceArray.length > 1 ? (
                <div>
                  <div className="destinationContainer" />
                  {this.state.distanceArray.map(
                    function(distance, index) {
                      if (index < this.state.distanceArray.length - 1) {
                        return distance.elements.forEach((distance, i) => {
                          if (index === i - 1) {
                            return (
                              <div className="destinationContainer">
                                <div className="destinationMiles">
                                  <i id="distanceIcon" className="fa fa-car" />
                                  <h4 className="destinationTitle">
                                    {distance.distance.text}
                                  </h4>
                                </div>
                                <div className="destinationMiles">
                                  <i
                                    id="distanceIcon"
                                    className="fa fa-clock-o"
                                  />
                                  <h4 className="destinationTitle">
                                    {distance.duration.text}
                                  </h4>
                                </div>
                              </div>
                            );
                          }
                        });
                      }
                    }.bind(this)
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="MapRightContainer">
          <div style={style} ref={ref => (this.refMap = ref)}>
            <div />
          </div>
        </div>
      </div>
    );
  }
}

// <Marker
// title={'The marker`s title will appear as a tooltip.'}
// name={'SOMA'}
// position={{lat: 34.0522, lng: -118.2437}} />

export default TripMap;
