package xin.wenjing.blogHao.util;

import org.springframework.util.PropertyPlaceholderHelper;
import org.thymeleaf.context.ITemplateContext;
import xin.wenjing.blogHao.entity.Settings;
import java.util.List;
import java.util.Properties;

/**
 * 功能描述
 * 内容处理工具类
 * @author: dreamChaser
 * @date: 2024年06月15日 23:53
 */
public class ScriptContentUtils {

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
            case "line" -> "\\n------\\n" + copyAddContent;
            case "emptyLine" -> "\\n \\n" + copyAddContent;
            default -> " " + copyAddContent;
        };
        processContent = processContent.replaceAll("[\\t\\r\\n]", "\\\\n");

        final Properties properties = new Properties();
        properties.setProperty("parseContent", processContent);
        properties.setProperty("copyMinLength", copyMinLength);

        final String scriptContent =
            """
                <script data-pjax type="text/javascript">
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

    /**
     * 返回模版名称
     * @param context
     * @return
     */
    public static String getTemplateId(ITemplateContext context) {
        try {
            String  templateName = context.getVariable(TEMPLATE_ID_VARIABLE).toString();
            return templateName != null && templateName.length() > 0 ? templateName : "";
        }catch (Exception e){
            return "";
        }
    }

    /**
     * 内容中英文空格脚本
     * @param config
     * @return
     */
    public static String panguScript(Settings.MiniTool config) {

        return """
                <script data-pjax src="/plugins/plugin-blog-hao/assets/static/libs/pangu-4.0.7/pangu.min.js"></script>
                <script data-pjax type="text/javascript">
                    %s
                    document.addEventListener("DOMContentLoaded", function() {
                       pangu.autoSpacingPage();
                    })
                </script>              
                """.formatted(config.getContentSpace().getScanContent());
    }

    /**
     * 站点失色样式
     * @return
     */
    public static String colorlessStyle() {
        return """
            <style type="text/css">
                html {
                   filter: grayscale(100%);
                   -webkit-filter: grayscale(100%);
                   -moz-filter: grayscale(100%);
                   -ms-filter: grayscale(100%);
                   -o-filter: grayscale(100%);
                   -webkit-filter: grayscale(1);
                }
            </style>
            """;
    }

    /**
     * 自定义标签元素脚本
     * @param version 版本号
     * @return
     */
    public static String blogHaoEle(String version){

        final Properties properties = new Properties();
        properties.setProperty("version", version);
        final String scriptTmpl = """
            <link rel="stylesheet" href="/plugins/plugin-blog-hao/assets/static/libs/swiper@8/swiper-bundle.min.css">
            <script data-pjax src="/plugins/plugin-blog-hao/assets/static/libs/swiper@8/swiper-bundle.min.js" type="text/javascript"></script>
            <link rel="stylesheet" href="/plugins/plugin-blog-hao/assets/static/custom/customEle.css?version=${version}" />
            <script src="/plugins/plugin-blog-hao/assets/static/custom/bloghaoTag.js?version=${version}" type="text/javascript"></script>
            <script data-pjax src="/plugins/plugin-blog-hao/assets/static/custom/swipperExecute.js?version=${version}" type="text/javascript" defer></script>
            """;
        return PROPERTY_PLACEHOLDER_HELPER.replacePlaceholders(scriptTmpl, properties);
    }

    /**
     * 幻灯片渲染
     * @param slideConfig 幻灯片配置
     * @return
     */
    public static String slideScript(Settings.SlideConfig slideConfig, String version){

        final Properties properties = new Properties();
        properties.setProperty("themeName", slideConfig.getThemeName());
        properties.setProperty("version", version);
        final String scriptTmpl = """
                <link rel="stylesheet" href="/plugins/plugin-blog-hao/assets/static/libs/revealjs/dist/reset.css" />
                <link rel="stylesheet" href="/plugins/plugin-blog-hao/assets/static/libs/revealjs/dist/reveal.css" />
                <link rel="stylesheet" href="/plugins/plugin-blog-hao/assets/static/libs/revealjs/dist/theme/${themeName}.css" id="theme">
                <script data-pjax src="/plugins/plugin-blog-hao/assets/static/libs/revealjs/dist/reveal.js"></script>
          """;

        String pluginTmpl = ebableSlidePlugin(slideConfig);
        return PROPERTY_PLACEHOLDER_HELPER.replacePlaceholders(scriptTmpl + pluginTmpl, properties);
    }

    /**
     * 幻灯片插件加载
     * @param slideConfig
     * @return
     */
    public static String ebableSlidePlugin(Settings.SlideConfig slideConfig){

        List<Settings.EnablePlugin> slidePluginList = slideConfig.getSlidePlugin().getEnablePlugin();
        StringBuilder injectPluginScript = new StringBuilder();

        for(int i = 0; i < slidePluginList.size(); i++){
            Settings.EnablePlugin enablePlugin = slidePluginList.get(i);
            switch (enablePlugin.getPluginName()){
                case "RevealMarkdown":
                    injectPluginScript.append("""
                        <script data-pjax src="/plugins/plugin-blog-hao/assets/static/libs/revealjs/plugin/markdown/markdown.js" defer></script>
                        """);
                    break;
                case "RevealHighlight":
                    injectPluginScript.append("""
                        <link rel="stylesheet" href="/plugins/plugin-blog-hao/assets/static/libs/revealjs/plugin/highlight/monokai.css">
                        <script src="/plugins/plugin-blog-hao/assets/static/libs/revealjs/plugin/highlight/highlight.js" data-pjax=""></script>
                        """);
                    break;
                case "RevealMath.KaTeX":
                    injectPluginScript.append("""
                        <script data-pjax src="/plugins/plugin-blog-hao/assets/static/libs/revealjs/plugin/math/math.js" defer></script>
                        """);
                    break;
                case "RevealSearch":
                    injectPluginScript.append("""
                        <script data-pjax src="/plugins/plugin-blog-hao/assets/static/libs/revealjs/plugin/search/search.js" defer></script>
                        """);
                    break;
                case "RevealNotes":
                    injectPluginScript.append("""
                        <script data-pjax src="/plugins/plugin-blog-hao/assets/static/libs/revealjs/plugin/notes/notes.js"></script>
                        """);
                    break;
                case "RevealZoom":
                    injectPluginScript.append("""
                        <script data-pjax src="/plugins/plugin-blog-hao/assets/static/libs/revealjs/plugin/zoom/zoom.js" defer></script>
                        """);
                    break;
                default:

            }
        }

        //执行完毕后进行初始化
        injectPluginScript.append("""
            <script data-pjax src="/plugins/plugin-blog-hao/assets/static/custom/slideExecute.js?version=${version}" type="text/javascript" defer></script>
            <script data-pjax="" type="text/javascript" defer>
                document.addEventListener("DOMContentLoaded", () => {
                    new executeSlideInit();
                })
                document.addEventListener("pjax:complete", () => {
                    new executeSlideInit();
                })
            </script>
            """);
        return injectPluginScript.toString();
    }

}