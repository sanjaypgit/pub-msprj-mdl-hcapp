import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Card from '@material-ui/core/Card';

import logo from '../../assets/logo.jpeg';
import Login from '../../screens/login/Login';
import Register from '../../screens/register/Register';
import './Header.css'


// Header Component Class
class Header extends Component {

    // Constructor instantiation and component state variables
    constructor(props) {
        super(props);
        this.state = {
            tabRegLoginId: 0,
            modalPoppedUp: false,
            regFirstname: "",
            regLastname: "",
            regEmail: "",
            regPassword: "",
            regContact: "",
            regFirstnameRequiredFlag: "displayOff",
            regInvalidFirstnameFlag: "displayOff",
            regLastnameRequiredFlag: "displayOff",
            regInvalidLastnameFlag: "displayOff",
            regEmailRequiredFlag: "displayOff",
            regPasswordRequiredFlag: "displayOff",
            regContactRequiredFlag: "displayOff",
            registrationSuccessFlag: false,
            regInvalidEmailFlag: "displayOff",
            regInvalidContactNumFlag: "displayOff",
            loginUsername: "",
            loginPassword: "",
            loginUsernameRequiredFlag: "displayOff",
            loginPasswordRequiredFlag: "displayOff",
            loginInvalidEmailFlag: "displayOff",
            userLoggedIn: sessionStorage.getItem("access-token") != null,
            refreshFlag: true
        }
    }

    // Logout Handler Function
    clickLogoutButtonHandler = () => {
        let logoutXHR = new XMLHttpRequest();
        let logoutBody = null;
        let bearerToken = sessionStorage.getItem("access-token");

        logoutXHR.open("POST", this.props.baseUrl + "/auth/logout");
        logoutXHR.setRequestHeader("Authorization", "Bearer " + bearerToken);
        logoutXHR.send(logoutBody);

        // Set state of "userLoggedIn" as FALSE
        let that = this;
        logoutXHR.addEventListener("readystatechange", function() {
            if (this.readyState === 4) {
                console.log(this.readyState);
                that.setState({userLoggedIn: false});
            }
        });

        // Clear session storage and reload the page
        sessionStorage.removeItem("uuid");
        sessionStorage.removeItem("access-token");
        window.location.reload();
    }

    // Modal-Open Handler Function
    openRegLoginModalHandler = () => {
        this.setState({
            modalPoppedUp: true,
            loginUsernameRequiredFlag: "displayOff",
            loginInvalidEmailFlag: "displayOff",
            loginPasswordRequiredFlag: "displayOff",
            regFirstnameRequiredFlag: "displayOff",
            regLastnameRequiredFlag: "displayOff",
            regEmailRequiredFlag: "displayOff",
            regInvalidEmailFlag: "displayOff",
            regPasswordRequiredFlag: "displayOff",
            regContactRequiredFlag: "displayOff",
            regInvalidContactNumFlag: "displayOff",
            regEmail: "",
            regContact: "",
            loginUsername: ""
        });
    }

    // Modal-Close Handler Function
    closeRegLoginModalHandler = () => {
        this.setState({
            modalPoppedUp: false,
            registrationSuccessFlag: false
        });
    }


    // Login & Register Tab Handler Function
    modalTabChangeHandler = (event, value) => {
        this.setState({
            tabRegLoginId: value,
            loginUsernameRequiredFlag: "displayOff",
            loginInvalidEmailFlag: "displayOff",
            loginPasswordRequiredFlag: "displayOff",
            regFirstnameRequiredFlag: "displayOff",
            regLastnameRequiredFlag: "displayOff",
            regEmailRequiredFlag: "displayOff",
            regInvalidEmailFlag: "displayOff",
            regPasswordRequiredFlag: "displayOff",
            regContactRequiredFlag: "displayOff",
            regInvalidContactNumFlag: "displayOff",
            regEmail: "",
            regContact: "",
            loginUsername: ""
        });
    }

    // Render Header UI
    render() {
        return (
            <Card>
                <header className="header-consultation-app">
                    <img src={logo} className="logo-consultation-app" alt="Logo Consultation App" />
                    <span className="header-title">HEALTHCARE APPLICATION</span>
                    {this.state.userLoggedIn ?
                        <div className="button-logout-at-header">
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={this.clickLogoutButtonHandler}
                            >
                                Logout
                            </Button>
                        </div>
                        :
                        <div className="button-login-at-header">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.openRegLoginModalHandler}
                            >
                                Login
                            </Button>
                        </div>
                    }
                </header>

                <Modal
                    contentLabel="RegLoginModal"
                    ModalTitle ="Authentication"
                    style={styleModal}
                    ariaHideApp={false}
                    isOpen={this.state.modalPoppedUp}
                    onRequestClose={this.closeRegLoginModalHandler}
                >
                    <header className="header-title-regloginmodal">Authentication</header>
                        <Tabs
                            className="tabs-registration-login"
                            value={this.state.tabRegLoginId}
                            onChange={this.modalTabChangeHandler}
                        >
                            <Tab label="LOGIN" />
                            <Tab label="REGISTER" />
                        </Tabs>
                    {this.state.tabRegLoginId === 0 &&
                        <Login baseUrl={this.props.baseUrl}>
                        </Login>
                    }
                    {this.state.tabRegLoginId === 1 &&
                        <Register
                            tabRegLoginId={this.state.tabRegLoginId}
                            baseUrl={this.props.baseUrl}
                            registrationSuccessFlag={this.state.registrationSuccessFlag}
                            regFirstnameRequiredFlag={this.state.regFirstnameRequiredFlag}
                            regInvalidFirstnameFlag={this.state.regInvalidFirstnameFlag}
                            regLastnameRequiredFlag={this.state.regLastnameRequiredFlag}
                            regInvalidLastnameFlag={this.state.regInvalidLastnameFlag}
                            regEmailRequiredFlag={this.state.regEmailRequiredFlag}
                            regInvalidEmailFlag={this.state.regInvalidEmailFlag}
                            regPasswordRequiredFlag={this.state.regPasswordRequiredFlag}
                            regContactRequiredFlag={this.state.regContactRequiredFlag}
                            regInvalidContactNumFlag={this.state.regInvalidContactNumFlag}
                            regEmail={this.state.regEmail}
                            regContact={this.state.regContact}
                        >
                        </Register>
                    }
                </Modal>
            </Card>
        )
    }
}

// Modal Styling
const styleModal = {
    content: {
        align: 'center',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 20,
        textAlign: 'left',
    }
};

export default Header;
