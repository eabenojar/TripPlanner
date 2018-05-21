import React, { Component } from 'react';
import '../styles/MainPage.css';
// import MapPageContainer from './MapPageContainer';
import { BrowserRouter as Link} from "react-router-dom";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
var api_key = process.env.API_KEY;



class MainPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      autocomplete: '',
      value: '',
      place: '',
      tripArray: [],
      city: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleEvent = this.handleEvent.bind(this);
  }
  submit(e){
    var autocomplete;
    e.preventDefault();
    this.props.history.push("/map");
    this.state.autocomplete = new this.props.google.maps.places.Autocomplete({
              types: ['(cities)'],
            });
  }
  handleSubmit(value){
    const {google} = this.props;
    var input = this.test;
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

          const city = {
            city: place.formatted_address,
            image: place.photos[0].getUrl({'maxWidth': 300, 'maxHeight': 200}),
            id: place.id,
            location: place.geometry.location
          }
          const tripArray = [...this.state.tripArray];

          tripArray.push({...city})
          // console.log("TRIP ARRAYYYY", tripArray, place)

          this.setState({
            tripArray: tripArray
          })
          this.handleEvent(place,tripArray)
        }

    }.bind(this))
   }
  handleChange(e){
    var value = e.target.value;
    this.setState({
      value: value
    })
    this.handleSubmit(value);
  }
  handleEvent(place, tripArray){
    console.log('THIS HANDLE STATE',tripArray)
    this.props.history.push({
      pathname: "/map",
      place: place,
      tripArray
    });

  }
  render(){
    return(
      <div className="mainPage-container">
        <h1 className="tripTitle"><strong className="strongTitle">Trip</strong>Planner</h1>

          <form className="example" action="/map" onSubmit={this.submit.bind(this)}>
            <input type="text" className="inputBar" value={this.state.value} placeholder="Start your journey" ref={ref => this.test = ref} onChange={this.handleChange} />
          </form>

      </div>
    )
  }
}

// <Link to="/map"><button>Back Home</button></Link>

export default GoogleApiWrapper({
  apiKey: api_key,
  libraries: ['visualization', 'places']
})(MainPage)