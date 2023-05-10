package digital.patron.webmobile.member.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Accessors(chain = true)
@EntityListeners(AuditingEntityListener.class)
public class GeneralMember implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 100, nullable = false, unique = true)
    private String email;
    @Column(length = 100, nullable = false)
    private String name;
    @Column(length = 10, nullable = false)
    private String status;
    @Column(length = 300)
    private String public_wallet;
    private LocalDate birth;
    @Column(length = 20)
    private String nationality;
    @Column(length = 50)
    private String preferredLanguage;
    @Column(length = 10)
    private String gender;
    @Column(length = 10)
    private String provider;
    private boolean marketing;
    private boolean tutorial_check;
    @Column(length = 300, nullable = false)
    private String password;
    @Column(nullable = false)
    private LocalDateTime last_login;
    @Column(nullable = false)
    private LocalDate create_time;

    public GeneralMember(String email, String name, String status,
                         String public_wallet, LocalDate birth, String nationality,
                         String preferredLanguage, String gender, String provider,
                         boolean marketing, boolean tutorial_check, String password,
                         LocalDateTime last_login, LocalDate create_time) {
        this.email = email;
        this.name = name;
        this.status = status;
        this.public_wallet = public_wallet;
        this.birth = birth;
        this.nationality = nationality;
        this.preferredLanguage = preferredLanguage;
        this.gender = gender;
        this.provider = provider;
        this.marketing = marketing;
        this.tutorial_check = tutorial_check;
        this.password = password;
        this.last_login = last_login;
        this.create_time = create_time;
    }

    @OneToMany(mappedBy = "generalMember")
    private Set<Collection> collections = new HashSet<>();
    @OneToMany(mappedBy = "generalMember")
    private Set<MemberSeenArtwork> memberSeenArtworks = new HashSet<>();
    @OneToMany(mappedBy = "generalMember")
    private Set<MemberLikedArtwork> memberLikedArtworks = new HashSet<>();
    @OneToMany(mappedBy = "generalMember")
    private Set<MemberLikedArtist> memberLikedArtists = new HashSet<>();
    @OneToMany(mappedBy = "generalMember")
    private Set<MemberWaitingExhibition> memberWaitingExhibitions = new HashSet<>();
    @OneToMany(mappedBy = "generalMember")
    private Set<SearchHistory> searchHistories = new HashSet<>();

    @Override
    public java.util.Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getUsername() {
        return null;
    }

    @Override
    public boolean isAccountNonExpired() {
        return false;
    }

    @Override
    public boolean isAccountNonLocked() {
        return false;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return false;
    }

    @Override
    public boolean isEnabled() {
        return false;
    }
}