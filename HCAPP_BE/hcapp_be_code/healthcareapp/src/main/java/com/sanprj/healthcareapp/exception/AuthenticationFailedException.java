package com.sanprj.healthcareapp.exception;

/**
 * User defined exception for unauthenticated access.
 */
public class AuthenticationFailedException extends ApplicationException {

    private static final long serialVersionUID = 7660768556081121813L;

    public AuthenticationFailedException(ErrorCode errorCode, Object... parameters) {
        super(errorCode, parameters);
    }

}