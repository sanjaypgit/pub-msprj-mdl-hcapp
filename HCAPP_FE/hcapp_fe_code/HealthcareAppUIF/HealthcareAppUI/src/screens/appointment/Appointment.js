import * as React from 'react';
import Typography from "@material-ui/core/Typography";
import { Paper, styled } from "@material-ui/core";
import Modal from 'react-modal';
import Button from "@material-ui/core/Button";
import './Appointment.css'
import {Component} from "react";
import DoctorDetails from "../doctorList/DoctorDetails";
import RateAppointment from "./RateAppointment";

// Appointment Class Component
class Appointment extends Component {

    // Constructor instantiation and component state variables
    constructor(props) {
        super(props);
        this.state = {
            modalRateAppointmentPoppedUp: false,
            timeSlotRequiredFlag: "displayOff",
            modalViewDetailsPoppedUp: false,
            bookedAppointmentsList: this.props.bookedAppointmentsList,
            appointmentId: "",
            doctorId: ""
        }
    }

    // Book appointment button handler function
    clickBookAppointmentButtonHandler = (appointmentId, doctorId) => {
        this.setState({
            modalRateAppointmentPoppedUp: true,
            timeSlot: "",
            appointmentId: appointmentId,
            doctorId: doctorId
        });
    }

    // Close rate appointment modal handler function
    closeRateAppointmentModalHandler = () => {
        this.setState({
            modalRateAppointmentPoppedUp: false,
            timeSlotRequiredFlag: "displayOff"
        });
    }

    // Close view details modal handler function
    closeViewDetailsModalHandler = () => {
        this.setState({
            modalViewDetailsPoppedUp: false,
            timeSlotRequiredFlag: "displayOff"
        });
    }

    // Function to render appointment component
    render() {
        return (
            <div>
                <Typography>
                    {this.state.bookedAppointmentsList.map((bookedAppointment) => (
                        <Item key={bookedAppointment.id}>
                            <Typography className="doctor-card">
                                <span className="doctor-card-name">{`Dr. ${bookedAppointment.doctorName}`}<br/></span>
                                <span className="doctor-card-speciality-ratings">{`Date: ${bookedAppointment.appointmentDate}`}<br/></span>
                                <span className="doctor-card-speciality-ratings">{`Symptoms: ${bookedAppointment.symptoms}`}<br/></span>
                                <span className="doctor-card-speciality-ratings">{`Previous Medical History: ${bookedAppointment.priorMedicalHistory}`}<br/><br/></span>
                                <div className="grid-container">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        id="button-rate-appointment"
                                        onClick={() => this.clickBookAppointmentButtonHandler(bookedAppointment.appointmentId, bookedAppointment.doctorId)}
                                    >
                                        RATE APPOINTMENT
                                    </Button>
                                </div>
                            </Typography>
                        </Item>
                    ))}
                </Typography>
                <Modal
                    contentLabel="RateAppointmentModal"
                    ModalTitle ="Rate Appointment"
                    style={styleModal}
                    ariaHideApp={false}
                    isOpen={this.state.modalRateAppointmentPoppedUp}
                    onRequestClose={this.closeRateAppointmentModalHandler}
                >
                    <RateAppointment
                        baseUrl={this.props.baseUrl}
                        appointmentId={this.state.appointmentId}
                        doctorId={this.state.doctorId}
                    >
                    </RateAppointment>
                </Modal>
                <Modal
                    contentLabel="ViewDetailsModal"
                    ModalTitle ="View Details"
                    style={styleModal}
                    ariaHideApp={false}
                    isOpen={this.state.modalViewDetailsPoppedUp}
                    onRequestClose={this.closeViewDetailsModalHandler}
                >
                    <DoctorDetails />
                </Modal>
            </div>
        );
    }
}

// Create styled paper component "Item"
const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    textAlign: 'left',
    color: theme.palette.text.secondary,
    height: 150,
    lineHeight: '60px',
    margin: '15px',
    padding: '20px',
    cursor: "pointer"
}));

// Styling variable for the modal
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

export default Appointment;




