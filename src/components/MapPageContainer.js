import React, { Component } from "react";
// import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { GoogleApiWrapper } from "google-maps-react";
import TripMap from "./TripMap";
// var API_KEY = process.env.API_KEY;

class MapPageContainer extends Component {
  render() {
    return <TripMap google={this.props.google} {...this.props} />;
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyCt-3KyopWMiFD8l3lIl4s3a0kTPVDlq4U",
  libraries: ["visualization", "places"]
})(MapPageContainer);
