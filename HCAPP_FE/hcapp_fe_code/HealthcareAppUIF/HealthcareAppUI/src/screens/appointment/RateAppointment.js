import * as React from 'react';
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import {Card, CardContent, TextField} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import {Component} from "react";
import {Rating} from "@material-ui/lab";
import './RateAppointment.css'

// RateAppointment Class Component
class RateAppointment extends Component {

    // Constructor instantiation and component state variables
    constructor(props) {
        super(props);
        this.state = {
            comments: "",
            ratingValue: null,
            ratingRequiredFlag: "displayOff",
            appointmentId: this.props.appointmentId,
            doctorId: this.props.doctorId
        }
    }

    // Star rating handler function
    clickRatingStarHandling = (event, newValue) => {
        this.setState({ratingValue: newValue})
    }

    // Comments change handler function
    commentsChangeHandling = (event) => {
        this.setState({comments: event.target.value})
    }

    // Modal button rate appointment handler function
    clickModalButtonRateAppointment = () => {
        this.state.ratingValue === null ?
            this.setState({ratingRequiredFlag: "displayOn"})
            :
            this.setState({ratingRequiredFlag: "displayOff"});

        // AJAX request for rate appointment using XMLHttpRequest (XHR) API
        if (this.state.ratingValue !== null)
        {
            // Construct request body, Instantiate XML AJAX API, Open POST request, Set headers and make call to Ratings API
            let rateAppointmentData = JSON.stringify({
                appointmentId: this.props.appointmentId,
                doctorId: this.props.doctorId,
                rating: this.state.ratingValue,
                comments: this.state.comments
            });

            let rateAppointmentXHR = new XMLHttpRequest();
            rateAppointmentXHR.open("POST", this.props.baseUrl + "/ratings", true);
            let bearerToken = sessionStorage.getItem("access-token");
            rateAppointmentXHR.setRequestHeader("Content-Type", "application/json");
            rateAppointmentXHR.setRequestHeader("Connection", "keep-alive");
            rateAppointmentXHR.setRequestHeader("Authorization", "Bearer " + bearerToken);
            rateAppointmentXHR.send(rateAppointmentData);
            rateAppointmentXHR.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    if (this.status !== 200) {
                        // Display error alert
                        alert(this.status + " Rate Appointment Failed!")
                    } else {
                        // Display success alert
                        alert("Thank you! Rating Successfully Submitted.");
                        window.location.reload();
                    }
                }
            });
        }
    }

    // Function to render the rate appointment component
    render() {
        return (
            <div>
                <Card>
                    <header className="header-rate-appointment">Rate an Appointment</header>
                    <CardContent>

                        <FormControl variant="standard" fullWidth>
                            <TextField
                                labelId="standard-basic-label"
                                id="standard-basic"
                                label={"Comments"}
                                variant="standard"
                                // value={" "}
                                multiline={true}
                                onChange={this.commentsChangeHandling}
                            >
                            </TextField>
                        </FormControl><br/><br/>

                        <InputLabel
                            id="ratings-title"
                        >
                            Ratings:
                            <Rating
                                name="half-rating"
                                id="ratings-title"
                                size="small"
                                value={this.state.ratingValue}
                                onChange={this.clickRatingStarHandling}
                                precision={0.5}
                            />
                            <FormHelperText className={this.state.ratingRequiredFlag}>
                                <span className="highlight-error-in-red">Select a rating</span>
                            </FormHelperText>
                        </InputLabel><br/><br/>

                        <Button
                            variant="contained"
                            color="primary"
                            id="button-rate-appointment"
                            onClick={this.clickModalButtonRateAppointment}
                        >
                            RATE APPOINTMENT
                        </Button>

                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default RateAppointment;




