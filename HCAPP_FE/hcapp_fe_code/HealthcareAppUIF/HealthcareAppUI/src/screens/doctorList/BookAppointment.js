import * as React from 'react';
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import LanguageIcon from '@material-ui/icons/Language';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import InputLabel from "@material-ui/core/InputLabel";
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import {Card, CardContent, MenuItem, Select, styled, TextField} from "@material-ui/core";
import {Component} from "react";
import DateFnsUtils from "@date-io/date-fns";
import './BookAppointment.css'

// BookAppointment Class Component
class BookAppointment extends Component {

    // Constructor instantiation and component state variables
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: new Date().toLocaleDateString(),
            selectedTimeSlot: "",
            timeSlotRequiredFlag: "displayOff",
            doctorNameBookAppointment: this.props.doctorNameBookAppointment,
            doctorUuidBookAppointment: this.props.doctorUuidBookAppointment,
            timeSlotListObj: [],
            timeSlotList: [],
            selectOneOrNone: "Timeslot Not Available",
            dateValidityFlag: "displayOff",
            userLoggedIn: sessionStorage.getItem("access-token") != null,
            userId: sessionStorage.getItem("uuid"),
            userName: sessionStorage.getItem("user-name"),
            userEmailId: sessionStorage.getItem("user-email-id"),
            symptoms: "",
            medicalHistory: "",
            bookedAppointmentsList: this.props.bookedAppointmentsList,
            customAlertOpenCloseFlag: false
        }
    }

    // Initialize as soon as the component is mounted
    componentDidMount() {

        // Fetch list of timeslots and set the value of component state "timeSlotList"
        // Construct request body, Instantiate XML AJAX API, Open GET request, Set headers and make call to Doctors/Timeslot/Date API
        let that = this;
        let timeSlotListData = null;
        let timeSlotListXHR = new XMLHttpRequest();
        let selectedDateObj = new Date(this.state.selectedDate);
        let yearOfSelectedDate = selectedDateObj.getFullYear();
        let monthOfSelectedDate = selectedDateObj.getMonth() + 1;
        let dateOfSelectedDate = selectedDateObj.getDate();
        if (selectedDateObj.getDate() <= 9)
            dateOfSelectedDate = "0" + dateOfSelectedDate;

        let queryString = "/doctors/"
            + this.state.doctorUuidBookAppointment
            + "/timeSlots?date="
            + yearOfSelectedDate
            + "-"
            + monthOfSelectedDate
            + "-"
            + dateOfSelectedDate;

        timeSlotListXHR.open("GET", this.props.baseUrl
            + encodeURI(queryString));

        timeSlotListXHR.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        timeSlotListXHR.send(timeSlotListData);
        timeSlotListXHR.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if (this.status !== 200) {
                    // Display error alert
                    alert(JSON.parse(this.responseText).message + ", TimeSlotList Mount Failed!")
                }
                else {
                    // Set states on success
                    that.setState({timeSlotListObj: JSON.parse(this.responseText)});
                    that.setState({timeSlotList: that.state.timeSlotListObj.timeSlot})
                    if (that.state.timeSlotList.length > 0)
                        that.setState({selectOneOrNone: "None"})
                }
            }
        });
    }

    // Click Modal Button Book Appointment Handler Function
    clickModalButtonBookAppointment = () => {

        let slotAlreadyBookedByUser = false;

        this.state.selectedTimeSlot === "" || this.state.selectedTimeSlot === undefined || this.state.selectedTimeSlot === "None"?
            this.setState({timeSlotRequiredFlag: "displayOn"})
            :
            this.setState({timeSlotRequiredFlag: "displayOff"});

        let isDateValid = new Date(this.state.selectedDate).toLocaleDateString() >= new Date().toLocaleDateString()
                            || new Date(this.state.selectedDate).getTime() >= new Date().getTime()
                            && this.state.selectedDate !== "None";

        isDateValid ?
            this.setState({dateValidityFlag: "displayOff"})
            :
            this.setState({dateValidityFlag: "displayOn"});

        let selectedDateObj = new Date(this.state.selectedDate);
        let yearOfSelectedDate = selectedDateObj.getFullYear();
        let monthOfSelectedDate = selectedDateObj.getMonth() + 1;
        let dateOfSelectedDate = selectedDateObj.getDate();
        if (selectedDateObj.getDate() <= 9)
            dateOfSelectedDate = "0" + dateOfSelectedDate;
        let selectedDateYYYYMMDD = yearOfSelectedDate + "-" + monthOfSelectedDate + "-" + dateOfSelectedDate;

        this.state.bookedAppointmentsList.map(
            (e) => {
                if (e.timeSlot === this.state.selectedTimeSlot &&
                    e.appointmentDate === selectedDateYYYYMMDD &&
                    e.doctorName === this.state.doctorNameBookAppointment) {
                    slotAlreadyBookedByUser = true;
                }
        });

        if (
            isDateValid === true &&
            slotAlreadyBookedByUser === true
        ) {
            this.setState({customAlertOpenCloseFlag: true});
        }

        // Post Appointment
        if (
            isDateValid === true &&
            this.state.selectedTimeSlot !== "" &&
            this.state.selectedTimeSlot !== undefined &&
            this.state.selectedTimeSlot !== "None" &&
            this.state.userLoggedIn &&
            slotAlreadyBookedByUser === false
        ) {
            // Construct request body, Instantiate XML AJAX API, Open POST request, Set headers and make call to Appointments API
            let selectedDateObj = new Date(this.state.selectedDate);
            let yearOfSelectedDate = selectedDateObj.getFullYear();
            let monthOfSelectedDate = selectedDateObj.getMonth() + 1;
            let dateOfSelectedDate = selectedDateObj.getDate();
            if (selectedDateObj.getDate() <= 9)
                dateOfSelectedDate = "0" + dateOfSelectedDate;

            let bookAnAppointmentData = JSON.stringify({
                "doctorId": this.state.doctorUuidBookAppointment,
                "doctorName": this.state.doctorNameBookAppointment,
                "userId": this.state.userId,
                "userName": this.state.userName,
                "userEmailId": this.state.userEmailId,
                "timeSlot": this.state.selectedTimeSlot,
                "appointmentDate": yearOfSelectedDate + "-" + monthOfSelectedDate + "-" + dateOfSelectedDate,
                "createdDate": "",
                "symptoms": this.state.symptoms,
                "priorMedicalHistory": this.state.medicalHistory
            });

            let bookAnAppointmentXHR = new XMLHttpRequest();
            bookAnAppointmentXHR.open("POST", this.props.baseUrl + "/appointments", true);
            let bearerToken = sessionStorage.getItem("access-token");
            bookAnAppointmentXHR.setRequestHeader("Content-Type", "application/json");
            bookAnAppointmentXHR.setRequestHeader("Connection", "keep-alive");
            bookAnAppointmentXHR.setRequestHeader("Authorization", "Bearer " + bearerToken);
            bookAnAppointmentXHR.send(bookAnAppointmentData);
            bookAnAppointmentXHR.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    if (this.status !== 201) {
                        // Display error alert
                        alert(this.status + " Appointment Booking Failed!")
                    } else {
                        // Display success alert
                        alert("Appointment Successfully Booked !");
                        window.location.reload();
                    }
                }
            });
        }
    }

    // Click Ok On Alert Button Handler Function
    clickOkOnAlertButtonHandler = () => {
        this.setState({customAlertOpenCloseFlag: false})
    }

    // Time Slot Change Handler Function
    timeSlotChangeHandler = (event) => {
        this.setState({selectedTimeSlot: event.target.value});
        this.setState({timeSlotRequiredFlag: "displayOff"});
    }

    // Appointment Date Change Handler Function
    appointmentDateChangeHandler = (event, date) => {
        this.setState({
            selectedDate: date,
            dateValidityFlag: "displayOff"
        });

        // Fetch list of timeslots and set the value of component state "timeSlotList"
        let that = this;
        let selectedDateObj = new Date(date);
        let yearOfSelectedDate = selectedDateObj.getFullYear();
        let monthOfSelectedDate = selectedDateObj.getMonth() + 1;
        let dateOfSelectedDate = selectedDateObj.getDate();
        if (selectedDateObj.getDate() <= 9)
            dateOfSelectedDate = "0" + dateOfSelectedDate;

        let timeSlotListData = null;
        let timeSlotListXHR = new XMLHttpRequest();
        timeSlotListXHR.open("GET", this.props.baseUrl
                                + "/doctors/"
                                + this.state.doctorUuidBookAppointment
                                + "/timeSlots?date="
                                + yearOfSelectedDate
                                + "-"
                                + monthOfSelectedDate
                                + "-"
                                + dateOfSelectedDate);

        timeSlotListXHR.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        timeSlotListXHR.send(timeSlotListData);
        timeSlotListXHR.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if (this.status !== 200) {
                    // Display error alert
                    alert(JSON.parse(this.responseText).message + ", TimeSlotList Mount Failed!")
                }
                else {
                    // Set states after success
                    that.setState({timeSlotListObj: JSON.parse(this.responseText)});
                    that.setState({timeSlotList: that.state.timeSlotListObj.timeSlot});
                    if (that.state.timeSlotList.length > 0)
                        that.setState({selectOneOrNone: "None"})
                    else
                        that.setState({selectOneOrNone: "No Timeslot Available"})
                }
            }
        });
    }

    // Medical History Change Handler Function
    medicalHistoryChangeHandler = (event) => {
        this.setState({
            medicalHistory: event.target.value,
        });
    }

    // Symptoms Change Handler Function
    symptomsChangeHandler = (event) => {
        this.setState({
            symptoms: event.target.value,
        });
    }

    // Function to render the BookAppointment component
    render() {
        return (
            <fragment>
            <div>
                <Card>
                    <header className="header-book-an-appointment">Book an Appointment</header>
                    <CardContent>
                        <FormControl variant="standard">
                            <TextField
                                labelId="doctors-name-label"
                                id="doctors-name-id"
                                label={"DoctorName *"}
                                value={this.state.doctorNameBookAppointment}
                                variant="standard"
                            >
                            </TextField>
                        </FormControl>

                        <br/>
                        <FormControl variant="standard">
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="Date picker inline"
                                    value={this.state.selectedDate}
                                    onChange={this.appointmentDateChangeHandler}
                                    KeyboardButtonProps = {{'aria-label': 'change date',}}
                                    autoOk={true}
                                />
                            </MuiPickersUtilsProvider>
                            <FormHelperText className={this.state.dateValidityFlag}>
                                <span className="highlight-error-in-red">Invalid! Pick today's or future date</span>
                            </FormHelperText>
                        </FormControl>

                        <br/><br/>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="select-time-slots">Timeslot</InputLabel>
                            <Select
                                className="select-time-slots"
                                onChange={this.timeSlotChangeHandler}
                                value={this.state.selectedTimeSlot}
                            >
                                <MenuItem value={this.state.selectOneOrNone}>
                                    <em>{this.state.selectOneOrNone}</em>
                                </MenuItem>
                                {this.state.timeSlotList.map((tmslot) => (
                                    <MenuItem
                                        value={tmslot}
                                    >
                                        {tmslot}
                                    </MenuItem>))
                                }
                            </Select>
                            <FormHelperText className={this.state.timeSlotRequiredFlag}>
                                <span className="highlight-error-in-red">Select a time slot</span>
                            </FormHelperText>
                        </FormControl><br/><br/>

                        {this.state.customAlertOpenCloseFlag === true &&
                            <AlertItem
                                variant='filled'
                                color='#696666'
                                icon={<LanguageIcon color='inherit'/>}
                                action={
                                    // </Button>
                                    <ButtonItem className="style-custom-alert-button" onClick={this.clickOkOnAlertButtonHandler}>
                                        OK
                                    </ButtonItem>
                                }
                            >
                                <AlertTitle>localhost:3000</AlertTitle>
                                Either the slot is already booked or not available
                            </AlertItem>
                        }

                        <FormControl variant="standard" fullWidth>
                            <TextField
                                labelId="standard-basic-label"
                                id="standard-basic"
                                label={"Medical History"}
                                variant="standard"
                                multiline={true}
                                onChange={this.medicalHistoryChangeHandler}
                            >
                            </TextField>
                        </FormControl><br/><br/>

                        <FormControl variant="standard" fullWidth>
                            <TextField
                                labelId="standard-basic-label"
                                id="standard-basic"
                                label={"Symptoms"}
                                variant="standard"
                                multiline={true}
                                onChange={this.symptomsChangeHandler}
                            >
                            </TextField>
                        </FormControl><br/><br/>

                        <Button
                            variant="contained"
                            color="primary"
                            id="button-book-appointment"
                            onClick={this.clickModalButtonBookAppointment}
                        >
                            BOOK APPOINTMENT
                        </Button>

                    </CardContent>
                </Card>
            </div>
            </fragment>
        );
    }
}

// Styled Alert Box
const AlertItem = styled(Alert)(({theme}) => ({
    ...theme.typography.body2,
    background: '#525050',
    textAlign: 'left',
    color: 'white',
    height: 100,
    width: 'auto',
    position: 'relative',
    marginLeft: '30%',
    padding: '10px',
    marginBottom: '10px',
    marginTop: '10px',
    wordWrap: true
}));

// Styled Button
const ButtonItem = styled(Button)(({theme}) => ({
    ...theme.typography.body2,
    color: theme.palette.text.primary,
    background: 'Cyan',
    marginRight: '20px',
    marginTop: '70px',
    marginBottom: '20px',
    cursor: 'pointer'
}));

export default BookAppointment;




