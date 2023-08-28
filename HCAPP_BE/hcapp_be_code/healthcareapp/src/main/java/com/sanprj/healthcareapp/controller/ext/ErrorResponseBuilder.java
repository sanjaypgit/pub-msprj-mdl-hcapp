package com.sanprj.healthcareapp.controller.ext;

import com.sanprj.healthcareapp.exception.ApplicationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * Error response builder.
 */
public class ErrorResponseBuilder<E extends ApplicationException> {

	private final HttpStatus status;
	private ErrorResponse errorResponse;

	public ErrorResponseBuilder(final HttpStatus status) {
		this.status = status;
	}

	public ErrorResponseBuilder<E> payload(E exc) {
		this.errorResponse = new ErrorResponse().code(exc.getErrorCode().getCode()).message(exc.getMessage());
		return this;
	}

	public ResponseEntity<ErrorResponse> build() {
		return new ResponseEntity<ErrorResponse>(errorResponse, null, status);
	}

}