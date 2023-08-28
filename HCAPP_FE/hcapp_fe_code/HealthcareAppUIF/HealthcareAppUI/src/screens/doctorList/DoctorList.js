import * as React from 'react';
import Typography from "@material-ui/core/Typography";
import Modal from 'react-modal';
import Button from "@material-ui/core/Button";
import {MenuItem, Paper, styled} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import {Rating} from "@material-ui/lab";
import Select from "@material-ui/core/Select";
import {Component} from "react";
import BookAppointment from "./BookAppointment";
import DoctorDetails from "./DoctorDetails";
import './DoctorList.css'

// DoctorList Class Component
class DoctorList extends Component {

    // Constructor instantiation and component state variables
    constructor(props) {
        super(props);
        this.state = {
            modalBookAppointmentPoppedUp: false,
            timeSlotRequiredFlag: "displayOff",
            modalViewDetailsPoppedUp: false,
            doctorsList: [],
            speciality: "",
            specialityList: [],
            doctorsListFiltered: [],
            doctorNameBookAppointment: "",
            doctorUuidBookAppointment: "",
            bookedAppointmentsList: this.props.bookedAppointmentsList,
            userLoggedIn: sessionStorage.getItem("access-token") !== null
        }
    }

    // Initialize as soon as the component is mounted
    componentDidMount() {
        let that = this;

        // Fetch list of doctors and set the value of component state "doctorsList"
        // Construct request body, Instantiate XML AJAX API, Open GET request, Set headers and make call to Doctors API
        let doctorsListData = null;
        let doctorsListXHR = new XMLHttpRequest();
        doctorsListXHR.open("GET", this.props.baseUrl + "/doctors");
        doctorsListXHR.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        doctorsListXHR.send(doctorsListData);
        doctorsListXHR.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if (this.status !== 200) {
                    // Display alert
                    alert(JSON.parse(this.responseText).message + ", DoctorList Mount Failed!")
                }
                else {
                    // Set doctorsList's state
                    that.setState({doctorsList: JSON.parse(this.responseText)});
                }
            }
        });


        // Fetch list of speciality and set the value of component state "specialityList"
        // Construct request body, Instantiate XML AJAX API, Open GET request, Set headers and make call to Speciality API
        let specialityListData = null;
        let specialityListXHR = new XMLHttpRequest();
        specialityListXHR.open("GET", this.props.baseUrl + "/doctors/speciality");
        specialityListXHR.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        specialityListXHR.send(specialityListData);
        specialityListXHR.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if (this.status !== 200) {
                    // Display alert
                    alert(JSON.parse(this.responseText).message + ", SpecialityList Mount Failed!")
                }
                else {
                    // Set specialityList's state
                    that.setState({specialityList: JSON.parse(this.responseText)});
                }
            }
        });
    }

    // Book appointment button handler function
    clickBookAppointmentButtonHandler = (doctorFullName, doctorUuid) => {
        this.state.userLoggedIn === false ?
            alert("Login to Book Appointment")
            :
            this.setState({
                modalBookAppointmentPoppedUp: true,
                timeSlot: "",
                doctorNameBookAppointment: doctorFullName,
                doctorUuidBookAppointment: doctorUuid
            });
    }

    // Book appointment handler function to close the modal
    closeBookAppointmentModalHandler = () => {
        this.setState({
            modalBookAppointmentPoppedUp: false,
            timeSlotRequiredFlag: "displayOff"
        });
    }

    // View doctor's detail handler function
    clickViewDetailsButtonHandler = (doctorFullName, doctorUuid) => {
        this.setState({
            modalViewDetailsPoppedUp: true,
            doctorNameBookAppointment: doctorFullName,
            doctorUuidBookAppointment: doctorUuid
        });
    }

    // View doctor's detail handler function to close the modal
    closeViewDetailsModalHandler = () => {
        this.setState({
            modalViewDetailsPoppedUp: false,
            timeSlotRequiredFlag: "displayOff"
        });
    }

    // Speciality change handler function
    specialityChangeHandler = (event) => {
        this.setState({speciality: event.target.value})

        let that = this;

        // Fetch filtered speciality using "query" string in API url & update the value of component state "doctorsListFiltered"
        let filterQueryString = "?speciality";
        if (event.target.value !== "" && event.target.value !== undefined) {
            filterQueryString += "=" + event.target.value;
        }

        // Construct request body, Instantiate XML AJAX API, Open GET request, Set headers and make call to Doctor's speciality API
        let doctorsListFilteredData = null;
        let doctorsListFilteredXHR = new XMLHttpRequest();
        doctorsListFilteredXHR.open("GET", this.props.baseUrl + "/doctors" + encodeURI(filterQueryString));
        doctorsListFilteredXHR.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        doctorsListFilteredXHR.send(doctorsListFilteredData);
        doctorsListFilteredXHR.addEventListener("readystatechange", function() {
            if (this.readyState === 4) {
                if (this.status !== 200) {
                    // Display alert
                    alert(JSON.parse(this.responseText).message + ", doctorsList Filter Failed!")
                }
                else {
                    // Update doctorsList's state based on the filter
                    that.setState({doctorsList: JSON.parse(this.responseText)});
                }
            }
        });
    }

    // Function to render the DoctorList component
    render() {
        return (
            <div>
                <label className="label-select-speciality" htmlFor="speciality-names">Select Speciality:</label>

                <br />
                <FormControl className="filter-form-control-specialty">
                    <Select
                        className="speciality-names"
                        onChange={this.specialityChangeHandler}
                        value={this.state.speciality}
                    >
                        <em className="style-none-option">NONE</em>
                        {this.state.specialityList.map( (spec) => (
                            <MenuItem
                                key={spec.id}
                                value={spec}
                            >
                                {spec}
                            </MenuItem>))
                        }
                    </Select>
                </FormControl>

                <Typography>
                    {this.state.doctorsList.map((e) => (
                        <Item key={e.id}>
                            <Typography className="doctor-card">
                                <span className="doctor-card-name">{`Doctor Name: ${e.firstName + " " + e.lastName}`}<br/><br/></span>
                                <span className="doctor-card-speciality-ratings">{`Speciality: ${e.speciality}`}<br/></span>
                                <span className="doctor-card-speciality-ratings">
                                    Ratings:
                                    <Rating
                                        name="half-rating-read"
                                        id="ratings-title"
                                        size="small"
                                        value={`${e.rating}`}
                                        precision={0.5}
                                        readOnly
                                    />
                                </span>

                                <div className="grid-container">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        id="button-book-appointment"
                                        onClick={() => this.clickBookAppointmentButtonHandler(e.firstName + " " + e.lastName, e.id)}
                                    >
                                        BOOK APPOINTMENT
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        id="button-view-details"
                                        onClick={() => this.clickViewDetailsButtonHandler(e.firstName + " " + e.lastName, e.id)}
                                    >
                                        VIEW DETAILS
                                    </Button>

                                </div>
                            </Typography>
                        </Item>
                    ))}
                </Typography>

                <Modal
                    contentLabel="BookAppointmentModal"
                    ModalTitle ="Book Appointment"
                    style={styleModal}
                    ariaHideApp={false}
                    isOpen={this.state.modalBookAppointmentPoppedUp}
                    onRequestClose={this.closeBookAppointmentModalHandler}
                >
                    <BookAppointment
                        baseUrl={this.props.baseUrl}
                        doctorNameBookAppointment={this.state.doctorNameBookAppointment}
                        doctorUuidBookAppointment={this.state.doctorUuidBookAppointment}
                        bookedAppointmentsList={this.props.bookedAppointmentsList}
                    >
                    </BookAppointment>
                </Modal>

                <Modal
                    contentLabel="ViewDetailsModal"
                    ModalTitle ="View Details"
                    style={styleModal}
                    ariaHideApp={false}
                    isOpen={this.state.modalViewDetailsPoppedUp}
                    onRequestClose={this.closeViewDetailsModalHandler}
                >
                    <DoctorDetails
                        baseUrl={this.props.baseUrl}
                        doctorNameBookAppointment={this.state.doctorNameBookAppointment}
                        doctorUuidBookAppointment={this.state.doctorUuidBookAppointment}
                    >
                    </DoctorDetails>
                </Modal>

            </div>
        );
    }
}

// Create styled Paper element named Item
const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    textAlign: 'left',
    color: theme.palette.text.secondary,
    height: 130,
    lineHeight: '60px',
    marginLeft: '30%',
    marginRight: '30%',
    padding: '10px',
    marginBottom: '10px',
    marginTop: '10px',
    width: '40%',
    alignContent: 'center'
}));

// Create variable "styleModal" to style the modal
const styleModal = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        width: '40%'
    }
};

export default DoctorList;




