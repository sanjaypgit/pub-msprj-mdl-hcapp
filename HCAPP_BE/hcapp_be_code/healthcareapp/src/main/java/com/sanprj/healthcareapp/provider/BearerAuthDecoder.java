package com.sanprj.healthcareapp.provider;

import com.sanprj.healthcareapp.exception.RestErrorCode;
import com.sanprj.healthcareapp.exception.UnauthorizedException;

import static com.sanprj.healthcareapp.constants.ResourceConstants.BEARER_AUTH_PREFIX;

/**
 * Provider to decode bearer token.
 */
public class BearerAuthDecoder {

	private final String accessToken;

	public BearerAuthDecoder(final String bearerToken) {
		if (!bearerToken.startsWith(BEARER_AUTH_PREFIX)) {
			throw new UnauthorizedException(RestErrorCode.ATH_003);
		}

		final String[] bearerTokens = bearerToken.split(BEARER_AUTH_PREFIX);
		if (bearerTokens.length != 2) {
			throw new UnauthorizedException(RestErrorCode.ATH_004);
		}
		this.accessToken = bearerTokens[1];
	}

	public String getAccessToken() {
		return accessToken;
	}

}