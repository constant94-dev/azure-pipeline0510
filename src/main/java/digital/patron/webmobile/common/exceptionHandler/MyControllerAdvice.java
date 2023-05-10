//package digital.patron.webmobile.common.exceptionHandler;
//
//import org.springframework.expression.spel.SpelEvaluationException;
//import org.springframework.web.bind.annotation.ControllerAdvice;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
//import org.thymeleaf.exceptions.TemplateInputException;
//
//import javax.servlet.http.HttpServletRequest;
//import java.text.ParseException;
//import java.util.NoSuchElementException;
//
//@ControllerAdvice
//public class MyControllerAdvice extends ResponseEntityExceptionHandler {
//    @ExceptionHandler(NoSuchElementException.class)
//    public String handleNoSuchElementException(NoSuchElementException elementException, HttpServletRequest request) {
//        return "redirect:/" + request.getRequestURI().substring(1,3) + "/error";
//    }
//    @ExceptionHandler(IllegalArgumentException.class)
//    public String handleIllegalArgumentException(IllegalArgumentException elementException, HttpServletRequest request) {
//        return "redirect:/" + request.getRequestURI().substring(1,3) + "/error";
//    }
//    @ExceptionHandler(NullPointerException.class)
//    public String handleNullPointerException(NullPointerException elementException, HttpServletRequest request) {
//        return "redirect:/" + request.getRequestURI().substring(1,3) + "/error";
//    }
//    @ExceptionHandler({TemplateInputException.class, ParseException.class, SpelEvaluationException.class})
//    public String handleTemplateInputException(TemplateInputException templateInputException,ParseException parseException, SpelEvaluationException spelEvaluationException, HttpServletRequest request) {
//        return "redirect:/" + request.getRequestURI().substring(1,3) + "/error";
//    }
//    @ExceptionHandler(Exception.class)
//    public String handleException(Exception exception, HttpServletRequest request) {
//        return "redirect:/" + request.getRequestURI().substring(1,3) + "/error";
//    }
//}
