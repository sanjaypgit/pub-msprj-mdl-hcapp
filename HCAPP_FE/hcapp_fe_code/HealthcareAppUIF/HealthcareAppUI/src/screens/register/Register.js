import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TabContainer from "../../common/tabContainer/TabContainer";
import './Register.css'

// Registration Class Component
class Register extends Component {

    // Constructor instantiation and component state variables
    constructor(props) {
        super(props);
        this.state = {
            tabRegLoginId: 0,
            modalPoppedUp: false,
            regFirstname: "",
            regLastname: "",
            regEmail: this.props.regEmail,
            regPassword: "",
            regContact: this.props.regContact,
            regFirstnameRequiredFlag: this.props.regFirstnameRequiredFlag,
            regInvalidFirstnameFlag: this.props.regInvalidFirstnameFlag,
            regLastnameRequiredFlag: this.props.regLastnameRequiredFlag,
            regInvalidLastnameFlag: this.props.regInvalidLastnameFlag,
            regEmailRequiredFlag: this.props.regEmailRequiredFlag,
            regPasswordRequiredFlag: this.props.regPasswordRequiredFlag,
            regContactRequiredFlag: this.props.regContactRequiredFlag,
            registrationSuccessFlag: this.props.registrationSuccessFlag,
            loginUsername: "",
            loginPassword: "",
            loginUsernameRequiredFlag: "displayOff",
            loginPasswordRequiredFlag: "displayOff",
            loginInvalidEmailFlag: "displayOff",
            regInvalidEmailFlag: this.props.regInvalidEmailFlag,
            regInvalidContactNumFlag: this.props.regInvalidContactNumFlag,
            userLoggedIn: sessionStorage.getItem("access-token") != null,
            refreshFlag: true,
            regErrorFlag: false,
        }
    }

    // Register Handler Function
    clickRegisterButtonHandler = () => {
        this.state.regFirstname === "" ?
            this.setState({regFirstnameRequiredFlag: "displayOn"})
            :
            this.setState({regFirstnameRequiredFlag: "displayOff"});

        // Firstname should contain only alphabet letters
        let regFirstname = this.state.regFirstname;
        let regRegexFname = /^[A-Z]+$/i;
        let isFirstnameValid = true;

        if (!regRegexFname.test(regFirstname.replace(/\s/g, '')))
            isFirstnameValid = false;

        this.state.regFirstname === "" || isFirstnameValid ?
            this.setState({regInvalidFirstnameFlag: "displayOff"})
            :
            this.setState({regInvalidFirstnameFlag: "displayOn"});

        this.state.regLastname === "" ?
            this.setState({regLastnameRequiredFlag: "displayOn"})
            :
            this.setState({regLastnameRequiredFlag: "displayOff"});

        // Lastname should contain only alphabet letters
        let regLastname = this.state.regLastname;
        let regRegexLname = /^[A-Z]+$/i;
        let isLastnameValid = true;

        if (!regRegexLname.test(regLastname.replace(/\s/g, '')))
            isLastnameValid = false;

        this.state.regLastname === "" || isLastnameValid ?
            this.setState({regInvalidLastnameFlag: "displayOff"})
            :
            this.setState({regInvalidLastnameFlag: "displayOn"});

        this.state.regEmail === "" ?
            this.setState({regEmailRequiredFlag: "displayOn"})
            :
            this.setState({regEmailRequiredFlag: "displayOff"});

        // Email Validation
        let regEmail = this.state.regEmail;
        let regRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i;
        let isEmailValid = true;

        if (!regRegex.test(regEmail.replace(/\s/g, '')))
            isEmailValid = false;

        this.state.regEmail === "" || isEmailValid ?
            this.setState({regInvalidEmailFlag: "displayOff"})
            :
            this.setState({regInvalidEmailFlag: "displayOn"});

        this.state.regPassword === "" ?
            this.setState({regPasswordRequiredFlag: "displayOn"})
            :
            this.setState({regPasswordRequiredFlag: "displayOff"});

        this.state.regContact === "" ?
            this.setState({regContactRequiredFlag: "displayOn"})
            :
            this.setState({regContactRequiredFlag: "displayOff"});

        // Contact Number Validation
        let regContactNum = this.state.regContact;
        let isContactNumValid = true;
        let regContactNumRegex = /^[0-9]+$/i;
        let isNonNumeric = !regContactNumRegex.test(regContactNum.replace(/\s/g, ''));

        if (regContactNum.length !== 10 || isNonNumeric)
            isContactNumValid = false;

        this.state.regContact === "" || isContactNumValid ?
            this.setState({regInvalidContactNumFlag: "displayOff"})
            :
            this.setState({regInvalidContactNumFlag: "displayOn"});

        // AJAX request for user registration using XMLHttpRequest (XHR) API
        if (this.state.regFirstname !== "" &&
            this.state.regLastname !== "" &&
            this.state.regEmail !== "" &&
            this.state.regPassword !== "" &&
            this.state.regContact !== "" &&
            isEmailValid &&
            isContactNumValid &&
            isFirstnameValid &&
            isLastnameValid
        ) {
            // Construct payload body
            let signupBody = JSON.stringify({
                "firstName": this.state.regFirstname,
                "lastName": this.state.regLastname,
                "dob": "", // This is set blank as per project task description
                "mobile": this.state.regContact,
                "password": this.state.regPassword,
                "emailId": this.state.regEmail
            });

            // Instantiate XML AJAX API, Open POST request, Set headers and make call to Register API
            let signupXHR = new XMLHttpRequest();
            signupXHR.open("POST", this.props.baseUrl + "/users/register");
            signupXHR.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            signupXHR.send(signupBody);

            let that = this;
            signupXHR.addEventListener("readystatechange", function() {
                if (this.readyState === 4) {
                    if (this.status !== 200) {
                        // Set error flag and display alert
                        that.setState({regErrorFlag: true});
                        alert("Registration Failed! " + JSON.parse(this.responseText).message)
                    }
                    else {
                        // Set success flag and login automatically after successful registration
                        that.setState({registrationSuccessFlag: true});
                        that.autoLoginPostReg();
                    }
                }
            });
        }
    }

    // Function to login automatically after successful registration
    autoLoginPostReg = () => {
        this.sleep(500)
            .then(r => {
                if (this.state.registrationSuccessFlag === true) {

                    // Construct payload body
                    let loginBody = null;

                    // Instantiate XML AJAX API, Open POST request, Set headers and make call to Login API
                    let loginXHR = new XMLHttpRequest();
                    loginXHR.open("POST", this.props.baseUrl + "/auth/login");
                    loginXHR.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    loginXHR.setRequestHeader("Authorization", "Basic "
                        + window.btoa(this.state.regEmail
                            + ":"
                            + this.state.regPassword)
                    );
                    loginXHR.send(loginBody);

                    let that = this;
                    loginXHR.addEventListener("readystatechange", function () {
                        if (this.readyState === 4) { // SP RVW
                            if (this.status !== 200) {
                                // Set error flag and display alert
                                that.setState({autoLoginErrorFlag: true});
                                alert("Auto Login Post Registration Failed! " + JSON.parse(this.responseText).message)
                            } else {
                                // Set userLoggedIn flag and set login keys and values in the session storage
                                const {accessToken} = JSON.parse(this.responseText);
                                const {emailAddress} = JSON.parse(this.responseText);
                                sessionStorage.setItem("uuid", JSON.parse(this.responseText).id);
                                sessionStorage.setItem("access-token", accessToken);
                                sessionStorage.setItem("user-name", JSON.parse(this.responseText).firstName);
                                sessionStorage.setItem("user-email-id", emailAddress);
                                that.setState({userLoggedIn: true});
                                that.refreshHandler();
                            }
                        }
                    });
                }
            })
    }

    // sleep function to enable pause for message displays
    sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    // Function to reload the page
    refreshHandler = () => {
        this.sleep(350)
            .then(r => {window.location.reload();})
    }

    // First name change handler function
    inputFirstNameChangeHandler = (e) => {
        this.state.regFirstname = this.props.regFirstnameRequiredFlag;
        this.setState({
            regFirstname: e.target.value,
            regFirstnameRequiredFlag: "displayOff",
            regInvalidFirstnameFlag: "displayOff",
            regErrorFlag: "displayOff"
        });
    }

    // Last name change handler function
    inputLastNameChangeHandler = (e) => {
        this.setState({
            regLastname: e.target.value,
            regLastnameRequiredFlag: "displayOff",
            regInvalidLastnameFlag: "displayOff",
            regErrorFlag: "displayOff"
        });
    }

    // Email change handler function
    inputEmailChangeHandler = (e) => {
        this.setState({
            regEmail: e.target.value,
            regEmailRequiredFlag: "displayOff",
            regInvalidEmailFlag: "displayOff",
            regErrorFlag: "displayOff"
        });
    }

    // Password change handler function
    inputRegisterPasswordChangeHandler = (e) => {
        this.setState({
            regPassword: e.target.value,
            regPasswordRequiredFlag: "displayOff",
            regErrorFlag: "displayOff"
        });
    }

    // Contact number change handler function
    inputContactChangeHandler = (e) => {
        this.setState({
            regContact: e.target.value,
            regContactRequiredFlag: "displayOff",
            regInvalidContactNumFlag: "displayOff",
            regErrorFlag: "displayOff"
        });
    }

    // Function to render registration component
    render() {
        return (
            <div>
                <TabContainer>

                    <FormControl required>
                        <InputLabel htmlFor="reg-firstname">First Name</InputLabel>
                        <Input
                            id="reg-firstname"
                            type="text"
                            firstname={this.state.regFirstname}
                            onChange={this.inputFirstNameChangeHandler}
                        />
                        <FormHelperText className={this.state.regFirstnameRequiredFlag}>
                            <span className="highlight-error-in-greybox">Please fill out this field</span>
                        </FormHelperText>
                        <FormHelperText className={this.state.regInvalidFirstnameFlag}>
                            <span className="highlight-error-in-red">Invalid! Enter alphabet letters only</span>
                        </FormHelperText>
                    </FormControl>

                    <br />
                    <br />
                    <FormControl required>
                        <InputLabel htmlFor="reg-lastname">Last Name</InputLabel>
                        <Input
                            id="reg-lastname"
                            type="text"
                            lastname={this.state.regLastname}
                            onChange={this.inputLastNameChangeHandler}
                        />
                        <FormHelperText className={this.state.regLastnameRequiredFlag}>
                            <span className="highlight-error-in-greybox">Please fill out this field</span>
                        </FormHelperText>
                        <FormHelperText className={this.state.regInvalidLastnameFlag}>
                            <span className="highlight-error-in-red">Invalid! Enter alphabet letters only</span>
                        </FormHelperText>
                    </FormControl>

                    <br />
                    <br />
                    <FormControl required>
                        <InputLabel htmlFor="reg-email">Email Id</InputLabel>
                        <Input
                            id="reg-email"
                            type="text"
                            email={this.state.regEmail}
                            onChange={this.inputEmailChangeHandler}
                        />
                        <FormHelperText className={this.state.regEmailRequiredFlag}>
                            <span className="highlight-error-in-greybox">Please fill out this field</span>
                        </FormHelperText>
                        <FormHelperText className={this.state.regInvalidEmailFlag}>
                            <span className="highlight-error-in-red">Enter valid Email</span>
                        </FormHelperText>
                    </FormControl>

                    <br />
                    <br />
                    <FormControl required>
                        <InputLabel htmlFor="reg-password">Password</InputLabel>
                        <Input
                            id="reg-password"
                            type="password"
                            registerpassword={this.state.regPassword}
                            onChange={this.inputRegisterPasswordChangeHandler}
                        />
                        <FormHelperText className={this.state.regPasswordRequiredFlag}>
                            <span className="highlight-error-in-greybox">Please fill out this field</span>
                        </FormHelperText>
                    </FormControl>

                    <br />
                    <br />
                    <FormControl required>
                        <InputLabel htmlFor="reg-contact">Mobile No.</InputLabel>
                        <Input
                            id="reg-contact"
                            type="text"
                            contact={this.state.regContact}
                            onChange={this.inputContactChangeHandler}
                        />
                        <FormHelperText className={this.state.regContactRequiredFlag}>
                            <span className="highlight-error-in-greybox">Please fill out this field</span>
                        </FormHelperText>
                        <FormHelperText className={this.state.regInvalidContactNumFlag}>
                            <span className="highlight-error-in-red">Enter valid mobile number</span>
                        </FormHelperText>
                    </FormControl>

                    <br />
                    <br />
                    {this.state.registrationSuccessFlag === true &&
                        <FormControl>
                                <span className="reg-login-success-message">
                                    Registration Successful. Logging In!
                                  </span>
                        </FormControl>
                    }
                    {this.state.registrationSuccessFlag === false && this.state.regErrorFlag === true &&
                        <FormControl>
                                <span className="reg-login-fail-message">
                                    Registration Failed!
                                  </span>
                        </FormControl>
                    }

                    <br />
                    <br />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.clickRegisterButtonHandler}
                    >
                        REGISTER
                    </Button>

                </TabContainer>
            </div>
        )
    }
}

export default Register;
