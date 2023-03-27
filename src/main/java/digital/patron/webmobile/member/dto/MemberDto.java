package digital.patron.webmobile.member.dto;

import digital.patron.webmobile.common.annotation.ValidEmail;
import digital.patron.webmobile.common.annotation.ValidPassword;
import lombok.AllArgsConstructor;
import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
public class MemberDto {
    @ValidEmail
    @NotNull
    @Size(min = 1, message = "{Size.memberDto.email}")
    private String email;

    @NotNull
    @Size(min = 1, message = "{Size.memberDto.lastName}")
    private String name;

    @ValidPassword
    private String password;

    private String provider;

    private Boolean marketing;


    public String getEmail() {
        return email;
    }

    public void setEmail(final String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(final String password) {
        this.password = password;
    }

    public String getProvider() {return provider;}

    public void setProvider(String provider) {this.provider = provider;}

    public Boolean getMarketing() {return marketing;}

    public void setMarketing(Boolean marketing) {this.marketing = marketing;}

    @Override
    public String toString() {
        final StringBuilder builder = new StringBuilder();
        builder.append("MemberDto [name=")
                .append(name)
                .append(", email=")
                .append(email)
                .append(", provider=")
                .append(provider)
                .append(", marketing=")
                .append(marketing).append("]");
        return builder.toString();
    }
}
