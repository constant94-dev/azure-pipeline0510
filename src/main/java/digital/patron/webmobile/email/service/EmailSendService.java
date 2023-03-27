package digital.patron.webmobile.email.service;

import digital.patron.webmobile.email.utils.EmailUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;
import java.util.Random;

@Service("mss")
public class EmailSendService {

    private final JavaMailSender mailSender;

    private int size;

    @Autowired
    public EmailSendService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }


//    //인증키 생성
//    public String getNumericKey(int size) {
//        this.size = size;
//        return getNumericAuthCode();
//    }
    //인증키 생성
    public String getDualKey(int size) {
        this.size = size;
        return getDualAuthCode();
    }

//    //인증코드 난수 발생
//    public String getNumericAuthCode() {
//        Random random = new Random();
//        StringBuffer buffer = new StringBuffer();
//        int num = 0;
//
//        while(buffer.length() < size) {
//            num = random.nextInt(10);
//            buffer.append(num);
//        }
//
//        return buffer.toString();
//    }

    public String getDualAuthCode() {
        String ZiMu = "QWERTYUIOPASDFGJKLZXCVBNM1234567890";
        StringBuffer buffer = new StringBuffer();
        Random random = new Random();
        while(buffer.length() < size) {
            int index = random.nextInt(ZiMu.length());
            char c = ZiMu.charAt(index);
            buffer.append(c);
        }
        return buffer.toString();
    }
    //작가에게 인증메일 보내기
    public String sendRegistrationAuthMailToGeneralMember(String email) {
        //6자리 난수 인증번호 생성
        String authKey = getDualKey(6);

        //인증메일 보내기
        try {
            EmailUtils sendMail = new EmailUtils(mailSender);
            sendMail.setSubject("파트론 회원가입 인증 메일입니다.");
            sendMail.setText(new StringBuffer().append("<div class=\"box\" style=\"width: 600px;height: auto;padding: 24px;margin:auto;box-sizing: border-box;\">")
                    .append("<img class=\"logo\" src=\"https://stpatron001.blob.core.windows.net/container-patron-renewal/icon/image.png\" alt=\"파트론 로고\" style=\"width: 118px;margin-bottom: 40px;\">")
                    .append("<h1 style=\"height: 47px;margin: 0 0 12px 0;padding: 0;font-weight: 400;font-size: 32px;line-height: 46px;color: #000000;\">회원가입 이메일 인증</h1>")
                    .append("<p style=\"width: 552px;height: auto;padding: 0;margin: 0;font-weight: 400;font-size: 16px;line-height: 23px;color: #424242;\">더 새롭게 예술하다, 파트론입니다.</p>")
                    .append("<p style=\"width: 552px;height: auto;padding: 0;margin: 0;font-weight: 400;font-size: 16px;line-height: 23px;color: #424242;\">회원가입을 위해 아래의 인증코드를 입력해주세요.</p>")
                    .append("<h2 class=\"code\" style=\"height: 28px;margin: 12px 0 24px 0;font-weight: 700;font-size: 24px;line-height: 28px;color: #000000;\">" + authKey + "</h2>")
                    .append("<p style=\"width: 552px;height: auto;padding: 0;margin: 0;font-weight: 400;font-size: 16px;line-height: 23px;color: #424242;\">이 요청을 제출하지 않았더라도 이 인증 코드가 없으면 계정에 액세스할 수 없습니다.</p>")
                    .append("<div style=\"width: 552px;padding-top: 12px;margin-top: 40px;font-weight: 400;font-size: 12px;line-height: 18px;color: #707070;border-top: 1px solid #F5F5F5;\">")
                    .append("본 메일은 발신전용이며, 회신이 안됩니다. 더 궁금하신 사항은 <span class=\"e-mail\" style=\"color: #2841FA;text-decoration: underline;\">help@patron.digital</span>으로 보내주세요.<br>")
                    .append("Copyrights (c)NODAMEN all rights reserved.")
                    .append("</div>")
                    .append("</div>")
                    .toString());
            sendMail.setFrom("help@patron.digital", "노다멘");
            sendMail.setTo(email);
            sendMail.send();
        } catch (MessagingException | UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        return authKey;
    }

    public String sendFindPasswordAuthMailToGeneralMember(String email) {
        //6자리 난수 인증번호 생성
        String authKey = getDualKey(6);

        //인증메일 보내기
        try {
            EmailUtils sendMail = new EmailUtils(mailSender);
            sendMail.setSubject("파트론 비밀번호 재설정 인증 메일입니다.");
            sendMail.setText(new StringBuffer().append("<div class=\"box\" style=\"width: 600px;height: auto;padding: 24px;margin:auto;box-sizing: border-box;\">")
                    .append("<img class=\"logo\" src=\"https://stpatron001.blob.core.windows.net/container-patron-renewal/icon/image.png\" alt=\"파트론 로고\" style=\"width: 118px;margin-bottom: 40px;\">")
                    .append("<h1 style=\"height: 47px;margin: 0 0 12px 0;padding: 0;font-weight: 400;font-size: 32px;line-height: 46px;color: #000000;\">비밀번호 재설정 이메일 인증</h1>")
                    .append("<p style=\"width: 552px;height: auto;padding: 0;margin: 0;font-weight: 400;font-size: 16px;line-height: 23px;color: #424242;\">더 새롭게 예술하다, 파트론입니다.</p>")
                    .append("<p style=\"width: 552px;height: auto;padding: 0;margin: 0;font-weight: 400;font-size: 16px;line-height: 23px;color: #424242;\">비밀번호를 잊으셨나요? 아래의 인증코드를 입력해주세요.</p>")
                    .append("<p style=\"width: 552px;height: auto;padding: 0;margin: 12px 0 0 0;font-weight: 400;font-size: 16px;line-height: 23px;color: #424242;\">만약 본인이 시도하지 않았다면, 사용중인 비밀번호를 변경해주세요.</p>")
                    .append("<h2 class=\"code\" style=\"height: 28px;margin: 12px 0 24px 0;font-weight: 700;font-size: 24px;line-height: 28px;color: #000000;\">" + authKey + "</h2>")
                    .append("<p style=\"width: 552px;height: auto;padding: 0;margin: 0;font-weight: 400;font-size: 16px;line-height: 23px;color: #424242;\">이 요청을 제출하지 않았더라도 이 인증 코드가 없으면 계정에 액세스할 수 없습니다.</p>")
                    .append("<div style=\"width: 552px;padding-top: 12px;margin-top: 40px;font-weight: 400;font-size: 12px;line-height: 18px;color: #707070;border-top: 1px solid #F5F5F5;\">")
                    .append("본 메일은 발신전용이며, 회신이 안됩니다. 더 궁금하신 사항은 <span class=\"e-mail\" style=\"color: #2841FA;text-decoration: underline;\">help@patron.digital</span>으로 보내주세요.<br>")
                    .append("Copyrights (c)NODAMEN all rights reserved.")
                    .append("</div>")
                    .append("</div>")
                    .toString());
            sendMail.setFrom("help@patron.digital", "노다멘");
            sendMail.setTo(email);
            sendMail.send();
        } catch (MessagingException | UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        return authKey;
    }
}
