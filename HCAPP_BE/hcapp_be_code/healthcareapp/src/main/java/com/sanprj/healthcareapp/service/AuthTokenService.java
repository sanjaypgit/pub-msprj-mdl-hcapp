package com.sanprj.healthcareapp.service;

import com.sanprj.healthcareapp.entity.User;
import com.sanprj.healthcareapp.entity.UserAuthToken;
import com.sanprj.healthcareapp.exception.AuthorizationFailedException;
import com.sanprj.healthcareapp.exception.UserErrorCode;
import com.sanprj.healthcareapp.provider.token.JwtTokenProvider;
import com.sanprj.healthcareapp.repository.UserAuthTokenRepository;
import com.sanprj.healthcareapp.repository.UserRepository;
import com.sanprj.healthcareapp.util.DateTimeProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.constraints.NotNull;
import java.time.ZonedDateTime;


@Service
public class AuthTokenService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserAuthTokenRepository userAuthDao;


	@Transactional(propagation = Propagation.MANDATORY)
	public UserAuthToken issueToken(final User user) {

		final ZonedDateTime now = DateTimeProvider.currentProgramTime();

		final UserAuthToken userAuthToken = userAuthDao.findByUserEmailId(user.getEmailId());
		final UserAuthTokenVerifier tokenVerifier = new UserAuthTokenVerifier(userAuthToken);
		if (tokenVerifier.isActive()) {
			return userAuthToken;
		}

		final JwtTokenProvider tokenProvider = new JwtTokenProvider(user.getPassword());
		final ZonedDateTime expiresAt = now.plusHours(8);
		final String authToken = tokenProvider.generateToken(user.getEmailId(), now, expiresAt);
		System.out.println(authToken);
		final UserAuthToken authTokenEntity = new UserAuthToken();
		authTokenEntity.setUser(user);
		authTokenEntity.setAccessToken(authToken);
		authTokenEntity.setLoginAt(now);
		authTokenEntity.setExpiresAt(expiresAt);
		userAuthDao.save(authTokenEntity);

		return authTokenEntity;

	}


	@Transactional(propagation = Propagation.REQUIRED)
	public void invalidateToken(final String accessToken) throws AuthorizationFailedException {

		final UserAuthToken userAuthToken = userAuthDao.findByAccessToken(accessToken);
		final UserAuthTokenVerifier tokenVerifier = new UserAuthTokenVerifier(userAuthToken);
		if (tokenVerifier.isNotFound()) {
			throw new AuthorizationFailedException(UserErrorCode.USR_005);
		}
		if (tokenVerifier.hasExpired()) {
			throw new AuthorizationFailedException(UserErrorCode.USR_006);
		}

		userAuthToken.setLogoutAt(DateTimeProvider.currentProgramTime());

		// Quick solution to resolve the login/logout issue if attempted thrice or more in the row.
		userAuthToken.setUser(null);

		userAuthDao.save(userAuthToken);
	}

	@Transactional(propagation = Propagation.REQUIRED)
	public UserAuthToken validateToken(@NotNull String accessToken) throws AuthorizationFailedException {
		final UserAuthToken userAuthToken = userAuthDao.findByAccessToken(accessToken);
		final UserAuthTokenVerifier tokenVerifier = new UserAuthTokenVerifier(userAuthToken);
		if (tokenVerifier.isNotFound() || tokenVerifier.hasLoggedOut()) {
			throw new AuthorizationFailedException(UserErrorCode.USR_005);
		}
		if (tokenVerifier.hasExpired()) {
			throw new AuthorizationFailedException(UserErrorCode.USR_006);
		}
		return userAuthToken;
	}

}