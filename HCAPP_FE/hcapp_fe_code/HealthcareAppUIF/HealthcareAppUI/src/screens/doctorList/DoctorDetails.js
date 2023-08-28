import * as React from 'react';
import {Card, CardContent, Typography} from "@material-ui/core";
import {Rating} from "@material-ui/lab";
import {Component} from "react";
import './DoctorDetails.css'

// DoctorDetails Class Component
class DoctorDetails extends Component {

    // Constructor instantiation and component state variables
    constructor(props) {
        super(props);
        this.state = {
            doctorName: this.props.doctorNameBookAppointment,
            doctorUUID: this.props.doctorUuidBookAppointment,
            doctorTotalExperience: "",
            doctorSpeciality: "",
            doctorDateOfBirth: "",
            doctorCity: "",
            doctorEmailId: "",
            doctorMobileNumber: "",
            doctorRating: ""
        }
    }

    // Initialize as soon as the component is mounted
    componentDidMount() {
        let that = this;

        // Fetch the details of the doctor and set the value of component (DoctorDetails) states
        // Construct request body, Instantiate XML AJAX API, Open GET request, Set headers and make call to Doctors/UUID API
        let doctorsDetailsData = null;
        let doctorsDetailsXHR = new XMLHttpRequest();
        let queryString = "/doctors/" + this.state.doctorUUID;
        let bearerToken = sessionStorage.getItem("access-token");

        doctorsDetailsXHR.open("GET", this.props.baseUrl + encodeURI(queryString));
        doctorsDetailsXHR.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        doctorsDetailsXHR.setRequestHeader("Cache-Control", "no-cache");
        doctorsDetailsXHR.setRequestHeader("Authorization", "Bearer " + bearerToken);
        doctorsDetailsXHR.send(doctorsDetailsData);
        doctorsDetailsXHR.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if (this.status !== 200) {
                    // Display erro alert
                    alert(this.status + " " + JSON.parse(this.responseText).message)
                } else {
                    // Set states after success
                    that.setState({doctorName: JSON.parse(this.responseText).firstName + " " + JSON.parse(this.responseText).lastName});
                    that.setState({doctorTotalExperience: JSON.parse(this.responseText).totalYearsOfExp});
                    that.setState({doctorSpeciality: JSON.parse(this.responseText).speciality});
                    that.setState({doctorDateOfBirth: JSON.parse(this.responseText).dob});
                    that.setState({doctorCity: (JSON.parse(this.responseText).address).city});
                    that.setState({doctorEmailId: JSON.parse(this.responseText).emailId});
                    that.setState({doctorMobileNumber: JSON.parse(this.responseText).mobile});
                    that.setState({doctorRating: JSON.parse(this.responseText).rating});
                }
            }
        });
    }

    // Function to render the DoctorDetails component
    render() {
        return (
            <div>
                <Card>
                    <header className="header-view-details">Doctor Details</header>
                    <CardContent>
                        <Typography style={{paddingLeft: '0px'}}>
                            <span className="doctor-name-style">{"Dr. " + this.state.doctorName}</span><br/><br/>
                            <span>Total Experience: {this.state.doctorTotalExperience}</span><br/>
                            <span>Speciality: {this.state.doctorSpeciality}</span><br/>
                            <span>Date of Birth: {this.state.doctorDateOfBirth}</span><br/>
                            <span>City: {this.state.doctorCity}</span><br/>
                            <span>Email: {this.state.doctorEmailId}</span><br/>
                            <span>Mobile: {this.state.doctorMobileNumber}</span><br/>
                            <span className="doctor-card-speciality-ratings">
                                    Ratings:
                                    <Rating
                                        name="half-rating-read"
                                        id="ratings-title"
                                        size="small"
                                        value={this.state.doctorRating}
                                        precision={0.5}
                                        readOnly
                                    />
                            </span>
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default DoctorDetails;




