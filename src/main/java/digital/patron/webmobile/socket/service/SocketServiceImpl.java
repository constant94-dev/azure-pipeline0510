package digital.patron.webmobile.socket.service;

import digital.patron.webmobile.socket.domain.SocketConnection;
import digital.patron.webmobile.socket.repository.SocketConnectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SocketServiceImpl implements SocketService{
    private final SocketConnectionRepository socketConnectionRepository;
//    private final SimpMessagingTemplate simpMessagingTemplate;
//    private final TempEmailStorageRepository tempEmailStorageRepository;
//    @Scheduled(fixedRate = 500L)
//    public void run() {
        //TODO 배포전 체크사항
//        tempEmailStorageRepository.removeExpiredCode(LocalDateTime.now().minusMinutes(30));
//        socketConnectionRepository.removeExpiredCode(LocalDateTime.now().minusMinutes(3));
//        List<SocketConnection> requestPlay = socketConnectionRepository.checkIfConnected("con","tv");
//        if(requestPlay != null && requestPlay.size() != 0){
//            for(SocketConnection request : requestPlay){
//                if(request.getEmail() != null){
//                    SocketDto socketDto = new SocketDto(null, null, null, null, null,
//                            request.getArtId(), request.getExhId(), request.getPlay());
//                    simpMessagingTemplate.convertAndSendToUser(request.getEmail(),"/queue/player", socketDto);
//                    socketConnectionRepository.resetArtAndExhIdAndPlay(request.getEmail(),"con");
//                }
//            }
//        }
//    }
    @Override
    public int requestConnectionToDevice(String email, String name, String code){
        if(socketConnectionRepository.findByRequestCode(code).isEmpty()) {return -2;}
        Optional<String> deviceId = socketConnectionRepository.getDeviceIdByRequestedCode(code,"dis");
        if(deviceId.isEmpty()){return -2;}
        Optional<SocketConnection> existingConnection = socketConnectionRepository.connectionAlreadyExist(email,"con");
        if(existingConnection.isPresent()){
            //if existing connection is same as requested connection
            if(existingConnection.get().getDeviceId().equalsIgnoreCase(deviceId.get())){
                socketConnectionRepository.deleteDuplicateRequest(email,code,"req");
                return 1;
            }
            return -1;
        }
        int numberOfConnections = socketConnectionRepository.getAllConnectionsByDeviceId(deviceId.get(),"con").size();
        if(numberOfConnections>=4) {
            int numberOfRequests = socketConnectionRepository.getAllConnectionsByDeviceId(deviceId.get(),"req").size();
            if((numberOfRequests>=1 && numberOfConnections == 4) || numberOfConnections>=5){return -3;}
        }
        return socketConnectionRepository.requestConnectionToDeviceByCode(email,name,code,"req");
    }
    @Override
    public String getConnectedDeviceNameByEmail(String email){
        return socketConnectionRepository.getDeviceNameByEmail(email,"con");
    }
    @Override
    public int disconnectDeviceFromTv(String email){
        return socketConnectionRepository.deleteByEmail(email);
    }

    @Override
    public int requestTvToPlayArtwork(Long artId, Long exhId, Boolean play, String email){
        return socketConnectionRepository.requestTvToPlayArtwork(email,artId,exhId,play,"con", "webMobile");
    }
}
