package com.locatebase.api.contact;

import com.locatebase.api.common.NotFoundException;
import com.locatebase.api.user.AppUser;
import com.locatebase.api.user.AppUserRepository;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    private final ContactMessageRepository messages;
    private final AppUserRepository users;

    public ContactService(ContactMessageRepository messages, AppUserRepository users) {
        this.messages = messages;
        this.users = users;
    }

    public ContactMessageResponse send(Jwt jwt, ContactRequest request) {
        AppUser user = users.findByFirebaseUid(jwt.getSubject())
                .orElseThrow(() -> new NotFoundException("No profile yet. Call POST /auth/sync after signing in."));

        ContactMessage m = new ContactMessage();
        m.setUserId(user.getId());
        m.setUserName(user.getName());
        m.setUserEmail(user.getEmail());
        m.setSubject(request.subject().trim());
        m.setMessage(request.message().trim());

        return ContactMessageResponse.from(messages.save(m));
    }
}