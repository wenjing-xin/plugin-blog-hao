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

    /**
     * 复制追加配置
     */
    @Data
    public static class CopyAdd{
        public final static String GROUP_NAME = "copyAdd";
        private String copyAddContent;
        private String divideType;
        private String copyMinLength;
        private boolean contentPageOnly;
    }

    /**
     * 小工具配置
     */
    @Data
    public static class MiniTool{
        public final static String GROUP_NAME = "miniTools";
        private ContentSpace contentSpace;
        private ContentIndent contentIndent;
    }

    /**
     * 小工具配置的子内容
     * 文章内容空格
     */
    @Data
    public static class ContentSpace{
        private boolean enableContentSpace;
        private String scanContent;
    }

    /**
     * 小工具配置的子内容
     * 文章内容首行缩进
     */
    @Data
    public static class ContentIndent{
        private boolean enableContentIndent;
        private String indentNodeName;
    }

}
