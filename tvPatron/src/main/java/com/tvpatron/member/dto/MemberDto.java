package com.tvpatron.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MemberDto {

    private String email;

    private String deviceId;

    private String password;

    private String modelType;

    private String deviceName;

}
