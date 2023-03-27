package digital.patron.webmobile.socket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SocketDto {
    String email;
    String deviceId;
    String deviceName;
    String code;
    Boolean status;
    Long artId;
    Long exhId;
    Boolean play;
}
