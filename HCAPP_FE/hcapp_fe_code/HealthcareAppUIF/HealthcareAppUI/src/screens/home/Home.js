import React, {Component} from 'react';
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import TabContainer from "../../common/tabContainer/TabContainer";
import DoctorList from "../doctorList/DoctorList";
import Appointment from "../appointment/Appointment";
import Header from '../../common/header/Header';
import './Home.css';


// Home Class Component
class Home extends Component {

    // Constructor instantiation and component state variables
    constructor(props) {
        super(props);
        this.state = {
            tabDoctorAppointmentId: 0,
            bookedAppointmentsList: [],
            userId: sessionStorage.getItem("uuid"),
            userLoggedIn: sessionStorage.getItem("access-token") !== null
        }
    }

    // Initialize as soon as the component is mounted
    componentDidMount() {
        let that = this;

        // Fetch list of booked appointments and set the value of component state "bookedAppointmentsList"
        if (this.state.userLoggedIn === true) {

            // Construct request payload
            let bookedAppointmentsListData = null;

            // Instantiate XML AJAX API, Open GET request, Set headers and make call to Appointments API
            let bookedAppointmentsListXHR = new XMLHttpRequest();
            let queryString = "/users/" + this.state.userId + "/appointments"
            let bearerToken = sessionStorage.getItem("access-token");
            bookedAppointmentsListXHR.open("GET", this.props.baseUrl + encodeURI(queryString));
            bookedAppointmentsListXHR.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            bookedAppointmentsListXHR.setRequestHeader("Cache-Control", "no-cache");
            bookedAppointmentsListXHR.setRequestHeader("Authorization", "Bearer " + bearerToken);
            bookedAppointmentsListXHR.send(bookedAppointmentsListData);
            bookedAppointmentsListXHR.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    if (this.status !== 200) {
                        // Set error flag and display alert
                        alert(" Fetching of list of booked appointments failed " + JSON.parse(this.responseText).message + this.status)
                    } else {
                        // Set state of the bookedAppointmentsList
                        that.setState({bookedAppointmentsList: JSON.parse(this.responseText)});
                    }
                }
            });
        }
    }

    // Tabs change handler
    tabsDoctorsAppointmentChangeHandler = (event, value) => {
        this.setState({
            tabDoctorAppointmentId: value
        });
    }

    // Function to render the home component
    render() {

        return (
            <div>

                {/* Element - Header */}
                <Header baseUrl={this.props.baseUrl} />

                <Tabs
                    className="tabs-doctors-appointment"
                    value={this.state.tabDoctorAppointmentId}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="doctors-appointment-tabs"
                    onChange={this.tabsDoctorsAppointmentChangeHandler}
                >
                    <Tab label="DOCTORS" />
                    <Tab label="APPOINTMENT" />
                </Tabs>

                {this.state.tabDoctorAppointmentId === 0 &&
                    <TabContainer>
                        <br />
                        <DoctorList
                            baseUrl={this.props.baseUrl}
                            bookedAppointmentsList={this.state.bookedAppointmentsList}
                        >
                        </DoctorList>
                    </TabContainer>
                }

                {this.state.tabDoctorAppointmentId === 1 && !(sessionStorage.getItem("access-token") != null) &&
                    <TabContainer>
                        <div>
                            <br />
                            <span className="message-appointment-before-login">Login to see appointments</span>
                        </div>
                    </TabContainer>
                }

                {this.state.tabDoctorAppointmentId === 1 && sessionStorage.getItem("access-token") != null &&
                    <TabContainer>
                        <div>
                            <br/>
                            <Appointment
                                baseUrl={this.props.baseUrl}
                                bookedAppointmentsList={this.state.bookedAppointmentsList}
                            >
                            </Appointment>
                        </div>
                    </TabContainer>
                }
            </div >
        )
    }
}

export default Home;