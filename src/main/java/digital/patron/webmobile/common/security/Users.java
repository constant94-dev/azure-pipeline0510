package digital.patron.webmobile.common.security;

import digital.patron.webmobile.member.domain.GeneralMember;
import lombok.Getter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.List;

@Getter
public class Users extends User {
    private final GeneralMember generalMember;

    public Users(GeneralMember generalMember) {
        super(generalMember.getEmail(), generalMember.getPassword(), List.of(new SimpleGrantedAuthority("ROLE_USER")));
        this.generalMember = generalMember;
    }
}
