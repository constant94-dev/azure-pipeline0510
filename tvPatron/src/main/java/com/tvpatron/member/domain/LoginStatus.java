package com.tvpatron.member.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter(AccessLevel.PRIVATE)
@AllArgsConstructor
public class LoginStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String deviceName;
    private String deviceId;
    private String code;
    private LocalDateTime createTime;


    public LoginStatus(String email, String deviceName, String deviceId, String code, LocalDateTime createTime) {
        this.email = email;
        this.deviceName = deviceName;
        this.deviceId = deviceId;
        this.code = code;
        this.createTime = createTime;
    }

    protected LoginStatus() {
    }
}
