package com.sanprj.healthcareapp.exception;

/**
 * User defined exception for unauthorized access.
 */
public class AuthorizationFailedException extends ApplicationException {

    private static final long serialVersionUID = 6409417559920703198L;

    public AuthorizationFailedException(ErrorCode errorCode, Object... parameters) {
        super(errorCode, parameters);
    }

}