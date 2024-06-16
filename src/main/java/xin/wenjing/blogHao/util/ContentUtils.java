package xin.wenjing.blogHao.util;

import org.springframework.util.PropertyPlaceholderHelper;
import org.thymeleaf.context.ITemplateContext;
import java.util.Properties;

/**
 * 功能描述
 * 内容处理工具类
 * @author: dreamChaser
 * @date: 2024年06月15日 23:53
 */
public class ContentUtils {

    private static final String TEMPLATE_ID_VARIABLE = "_templateId";

    static final PropertyPlaceholderHelper
        PROPERTY_PLACEHOLDER_HELPER = new PropertyPlaceholderHelper("${", "}");


    /**
     * 复制追加内容处理
     * @param copyAddContent 追加的内容
     * @param divideType 分割符
     * @param copyMinLength 触发内容追加长度
     * @return 最终复制的内容
     */
    public static String copyAddScrProcess(String copyAddContent, String divideType, String copyMinLength) {

        String processContent = switch (divideType) {
            case "line" -> "\\n---\\n" + copyAddContent;
            case "emptyLine" -> "\\n \\n" + copyAddContent;
            default -> " " + copyAddContent;
        };
        processContent = processContent.replaceAll("[\\t\\r\\n]", "\\\\n");

        final Properties properties = new Properties();
        properties.setProperty("parseContent", processContent);
        properties.setProperty("copyMinLength", copyMinLength);

        final String scriptContent =
            """
                <script data-pjax>
                    function contentParse(content) {
                        let parsed = content;
                        parsed = parsed.replaceAll("#url", window.location.href);
                        parsed = parsed.replaceAll("#site", window.location.host);
                        return parsed;
                    }
                    window.addEventListener("copy", (event) => {
                        let clipboard = event.clipboardData || window.clipboardData
                        let clipboardText = window.getSelection().toString()
                        if (!clipboard || clipboardText.length <= ${copyMinLength}) {
                            return;
                        }else if (clipboardText !== "") {
                            event.preventDefault()
                            clipboard.setData("text/plain", clipboardText + contentParse("${parseContent}"))
                        }
                    })
                </script>
            """;
        return PROPERTY_PLACEHOLDER_HELPER.replacePlaceholders(scriptContent, properties);
    }

    /**
     * 检测是否为文章页面和独立页面
     * @param context 模版内容
     * @return
     */
    public static boolean notContentTemplate(ITemplateContext context) {
        return !"post".equals(context.getVariable(TEMPLATE_ID_VARIABLE))
            && !"page".equals(context.getVariable(TEMPLATE_ID_VARIABLE));
    }

}
