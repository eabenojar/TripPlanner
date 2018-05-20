import React, { Component } from 'react';
// import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { GoogleApiWrapper } from 'google-maps-react'
import TripMap from './TripMap';
var api_key = process.env.API_KEY;


class MapPageContainer extends Component {
  constructor(props){
    super(props)
  }
  render() {
      // console.log('THIS PROPS MAP CONTAINER', this.props)
    return(
        <TripMap google={this.props.google} props={this.props}/>
    )
  }
}

// const MyMapComponent = withScriptjs(withGoogleMap((props) =>
//   <GoogleMap
//     defaultZoom={8}
//     defaultCenter={{ lat: -34.397, lng: 150.644 }}
//   >
//     {props.isMarkerShown && <Marker position={{ lat: -34.397, lng: 150.644 }} />}
//   </GoogleMap>
// ))

//export the container WITHIN the GoogleApiWrapper
 export default GoogleApiWrapper({
   apiKey: api_key,
   libraries: ['visualization', 'places']
 })(MapPageContainer)
