package xin.wenjing.blogHao.processor;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.PropertyPlaceholderHelper;
import org.thymeleaf.context.ITemplateContext;
import org.thymeleaf.model.IModel;
import org.thymeleaf.model.IModelFactory;
import org.thymeleaf.processor.element.IElementModelStructureHandler;
import reactor.core.publisher.Mono;
import run.halo.app.plugin.PluginContext;
import run.halo.app.plugin.ReactiveSettingFetcher;
import run.halo.app.theme.dialect.TemplateHeadProcessor;
import xin.wenjing.blogHao.entity.Settings;
import xin.wenjing.blogHao.util.ScriptContentUtils;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;

/**
 * 小工具脚本注入
 * @author: dreamChaser
 * @date: 2024年06月16日 00:21
 */
@Component
@AllArgsConstructor
public class MiniToolsProcessor implements TemplateHeadProcessor {

    private final ReactiveSettingFetcher settingFetcher;

    static final PropertyPlaceholderHelper PROPERTY_PLACEHOLDER_HELPER = new PropertyPlaceholderHelper("${", "}");

    private final PluginContext pluginContext;

    @Override
    public Mono<Void> process(ITemplateContext context, IModel model, IElementModelStructureHandler structureHandler) {
        return settingFetcher.fetch(Settings.MiniTool.GROUP_NAME, Settings.MiniTool.class)
            .doOnNext( miniTool -> {
                String scriptRes = miniToolsScript(miniTool, context);
                final IModelFactory modelFactory = context.getModelFactory();
                model.add(modelFactory.createText(scriptRes));
            }).then();
    }

    private String miniToolsScript(Settings.MiniTool miniTool, ITemplateContext context) {

        final Properties contentIndentProperties = new Properties();
        contentIndentProperties.setProperty("postNodeName", miniTool.getContentIndent().getPostIndentNodeName());
        contentIndentProperties.setProperty("pageNodeName", miniTool.getContentIndent().getPageIndentNodeName());
        contentIndentProperties.setProperty("version", pluginContext.getVersion());
        List<String> excludeNodeName = new ArrayList<>();
        miniTool.getContentIndent().getExcludeNodeList().stream().forEach(item -> {
            excludeNodeName.add(item.getNodeName());
        });

        contentIndentProperties.setProperty("excludeEle", excludeNodeName.toString());
        StringBuilder injectCode = new StringBuilder();

        // 中英文空格脚本
        if(miniTool.getContentSpace().isEnableContentSpace()){
            injectCode.append(ScriptContentUtils.panguScript(miniTool));
        }

        // 段落内容首行缩进
        if(miniTool.getContentIndent().isEnableContentIndent()){

            String templateId = ScriptContentUtils.getTemplateId(context);

            final String jsScript = """
                                      <script src="/plugins/plugin-blog-hao/assets/static/custom/textIndent.js?v=${version}"></script>
                                      <script data-pjax type="text/javascript">
                                          function initTextIndent(){
                                              let nodeName = {
                                                    postNodeName: "${postNodeName}",
                                                    pageNodeName: "${pageNodeName}"
                                              }
                                              let excludeEle = "${excludeEle}";
                                              new executeTextIndent(nodeName, excludeEle, ${isOnlyPost});
                                          }
                                          document.addEventListener("DOMContentLoaded", function() {
                                              initTextIndent();
                                          });
                                          document.addEventListener("pjax:complete", function() {
                                              initTextIndent();
                                          });
                                      </script>
                                    """;
            if(miniTool.getContentIndent().getIsOnlyPostIndent().equals("onlyPost") && templateId.equals("post")){
                contentIndentProperties.setProperty("isOnlyPost", "true");
            }else if(miniTool.getContentIndent().getIsOnlyPostIndent().equals("globalPage")){
                contentIndentProperties.setProperty("isOnlyPost", "false");
            }
            String executeJs = PROPERTY_PLACEHOLDER_HELPER.replacePlaceholders(jsScript, contentIndentProperties);
            injectCode.append(executeJs);
        }

        return injectCode.toString();
    }


}
