import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TabContainer from '../../common/tabContainer/TabContainer';
import './Login.css'

// Login Class Component
class Login extends Component {

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
            regLastnameRequiredFlag: "displayOff",
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
            loginErrorFlag: false
        }
    }

    // Click Login Button Handler Function
    clickLoginButtonHandler = () => {
        this.state.loginUsername === "" ?
            this.setState({loginUsernameRequiredFlag: "displayOn"})
            :
            this.setState({loginUsernameRequiredFlag: "displayOff"});

        // Email Validation
        let loginEmail = this.state.loginUsername;
        let loginRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i;
        let isEmailValid = true
        if (!loginRegex.test(loginEmail.replace(/\s/g, '')))
            isEmailValid = false;

        this.state.loginUsername === "" || isEmailValid ?
            this.setState({loginInvalidEmailFlag: "displayOff"})
            :
            this.setState({loginInvalidEmailFlag: "displayOn"});

        this.state.loginPassword === "" ?
            this.setState({loginPasswordRequiredFlag: "displayOn"})
            :
            this.setState({loginPasswordRequiredFlag: "displayOff"});

        if (this.state.loginUsername !== "" && isEmailValid && this.state.loginPassword !== "") {
            // Instantiate XML AJAX API, Open POST request, Set headers and make call to Auth/Login API
            let loginBody = null;
            let loginXHR = new XMLHttpRequest();
            loginXHR.open("POST", this.props.baseUrl + "/auth/login");
            loginXHR.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            loginXHR.setRequestHeader("Authorization", "Basic "
                + window.btoa(this.state.loginUsername
                    + ":"
                    + this.state.loginPassword)
            );
            loginXHR.send(loginBody);

            let that = this;
            loginXHR.addEventListener("readystatechange", function() {
                if (this.readyState === 4) { // SP RVW
                    if (this.status !== 200) {
                        // Set error flag and display error alert
                        that.setState({loginErrorFlag: true});
                        alert(JSON.parse(this.responseText).message + ", Login Failed!")
                    }
                    else {
                        // set session on success
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
    }

    // Sleep function for taking a small pause after message display
    sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    // Reload page function
    refreshHandler = () => {
        this.sleep(350)
            .then(r => {window.location.reload();})
    }

    // Input Username Change Handler Function
    inputUsernameChangeHandler = (e) => {
        this.setState({
            loginUsername: e.target.value,
            loginUsernameRequiredFlag: "displayOff",
            loginInvalidEmailFlag: "displayOff",
            loginErrorFlag: "displayOff"
        });
    }

    // Input Login Password Change Handler Function
    inputLoginPasswordChangeHandler = (e) => {
        this.setState({
            loginPassword: e.target.value,
            loginPasswordRequiredFlag: "displayOff",
            loginErrorFlag: "displayOff"
        });
    }

    // Function to render the login component
    render() {
        return (
            <div>
                <TabContainer>
                    <FormControl required>
                        <InputLabel htmlFor="login-username">Email</InputLabel>
                        <Input
                            id="login-username"
                            type="text"
                            // type="email"
                            username={this.state.loginUsername}
                            onChange={this.inputUsernameChangeHandler}
                        />
                        <FormHelperText className={this.state.loginUsernameRequiredFlag}>
                            <span className="highlight-error-in-greybox">Please fill out this field</span>
                        </FormHelperText>
                        <FormHelperText className={this.state.loginInvalidEmailFlag}>
                            <span className="highlight-error-in-red">Enter valid Email</span>
                        </FormHelperText>
                    </FormControl>
                    <br />
                    <br />
                    <FormControl required>
                        <InputLabel htmlFor="login-password">Password</InputLabel>
                        <Input
                            id="login-password"
                            type="password"
                            loginpassword={this.state.loginPassword}
                            onChange={this.inputLoginPasswordChangeHandler}
                        />
                        <FormHelperText className={this.state.loginPasswordRequiredFlag}>
                            <span className="highlight-error-in-greybox">Please fill out this field</span>
                        </FormHelperText>
                    </FormControl>
                    <br />
                    <br />
                    {this.state.userLoggedIn === true && // SP RVW
                        <Typography>
                            <span className="reg-login-success-message">
                                Login Successful!
                            </span>
                        </Typography>
                    }
                    {this.state.userLoggedIn === false && this.state.loginErrorFlag === true && // SP RVW
                        <Typography>
                            <span className="reg-login-fail-message">
                                Login Failed!
                            </span>
                        </Typography>
                    }
                    <br />
                    <br />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.clickLoginButtonHandler}
                    >
                        LOGIN
                    </Button>
                </TabContainer>
            </div>
        )
    }
}

export default Login;
