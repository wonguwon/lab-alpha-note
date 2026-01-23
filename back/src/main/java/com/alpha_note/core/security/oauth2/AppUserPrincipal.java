package com.alpha_note.core.security.oauth2;

import com.alpha_note.core.user.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

/**
 * OAuth2/OIDC 인증 후 사용되는 통합 Principal
 * - User 엔티티와 OAuth2/OIDC 정보를 함께 관리
 * - OAuth2User와 OidcUser 인터페이스를 모두 구현하여 Google(OIDC), 카카오, GitHub 등 모든 Provider 지원
 */
@Getter
public class AppUserPrincipal implements OAuth2User, OidcUser {

    private final User user;
    private final OAuth2User oauth2Delegate;
    private final OidcUser oidcDelegate;  // OIDC일 경우만 non-null
    private final boolean isNewUser;  // 신규 사용자 여부

    /**
     * OIDC 로그인용 생성자 (Google 등)
     */
    public AppUserPrincipal(User user, OidcUser oidcUser, boolean isNewUser) {
        this.user = user;
        this.oauth2Delegate = oidcUser;
        this.oidcDelegate = oidcUser;
        this.isNewUser = isNewUser;
    }

    /**
     * 일반 OAuth2 로그인용 생성자 (카카오, GitHub 등)
     */
    public AppUserPrincipal(User user, OAuth2User oauth2User, boolean isNewUser) {
        this.user = user;
        this.oauth2Delegate = oauth2User;
        this.oidcDelegate = null;
        this.isNewUser = isNewUser;
    }
    
    /**
     * OIDC 로그인용 생성자 (하위 호환성, 기존 사용자로 간주)
     */
    public AppUserPrincipal(User user, OidcUser oidcUser) {
        this(user, oidcUser, false);
    }

    /**
     * 일반 OAuth2 로그인용 생성자 (하위 호환성, 기존 사용자로 간주)
     */
    public AppUserPrincipal(User user, OAuth2User oauth2User) {
        this(user, oauth2User, false);
    }

    // ========== OidcUser 인터페이스 구현 (OIDC 전용) ==========

    @Override
    public Map<String, Object> getClaims() {
        return oidcDelegate != null ? oidcDelegate.getClaims() : null;
    }

    @Override
    public OidcUserInfo getUserInfo() {
        return oidcDelegate != null ? oidcDelegate.getUserInfo() : null;
    }

    @Override
    public OidcIdToken getIdToken() {
        return oidcDelegate != null ? oidcDelegate.getIdToken() : null;
    }

    // ========== OAuth2User 인터페이스 구현 (공통) ==========

    @Override
    public Map<String, Object> getAttributes() {
        return oauth2Delegate.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return oauth2Delegate.getAuthorities();
    }

    @Override
    public String getName() {
        return oauth2Delegate.getName();
    }
}
