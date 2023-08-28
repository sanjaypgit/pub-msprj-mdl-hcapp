package com.sanprj.healthcareapp.exception;

/**
 * User defined exception for all services that does a lookup of entity.
 */
public class EntityNotFoundException extends ApplicationException {

    private static final long serialVersionUID = 2848416716183340588L;

    public EntityNotFoundException(ErrorCode errorCode, Object... parameters) {
        super(errorCode, parameters);
    }

}