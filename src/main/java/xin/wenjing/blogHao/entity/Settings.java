package xin.wenjing.blogHao.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 功能描述
 *
 * @author: dreamChaser
 * @date: 2024年06月16日 00:01
 */
@AllArgsConstructor
public class Settings {

    @Data
    public static class CopyAdd{
        public final static String GROUP_NAME = "copyAdd";
        private String copyAddContent;
        private String divideType;
        private String copyMinLength;
        private Boolean contentPageOnly;
    }

}
