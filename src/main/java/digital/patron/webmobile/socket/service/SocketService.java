package digital.patron.webmobile.socket.service;

public interface SocketService {
    int requestConnectionToDevice(String email, String name, String code);

    String getConnectedDeviceNameByEmail(String email);

    int disconnectDeviceFromTv(String email);

    int requestTvToPlayArtwork(Long artId, Long exhId, Boolean play, String email);
}
