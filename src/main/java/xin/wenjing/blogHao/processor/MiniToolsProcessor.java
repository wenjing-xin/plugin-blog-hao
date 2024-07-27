package xin.wenjing.blogHao.processor;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.PropertyPlaceholderHelper;
import org.thymeleaf.context.ITemplateContext;
import org.thymeleaf.model.IModel;
import org.thymeleaf.model.IModelFactory;
import org.thymeleaf.processor.element.IElementModelStructureHandler;
import reactor.core.publisher.Mono;
import run.halo.app.plugin.ReactiveSettingFetcher;
import run.halo.app.theme.dialect.TemplateHeadProcessor;
import xin.wenjing.blogHao.entity.Settings;
import xin.wenjing.blogHao.util.ScriptContentUtils;
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

        StringBuilder injectCode = new StringBuilder();

        // 中英文空格脚本
        if(miniTool.getContentSpace().isEnableContentSpace()){
            injectCode.append(ScriptContentUtils.panguScript(miniTool));
        }

        // 段落内容首行缩进
        if(miniTool.getContentIndent().isEnableContentIndent()){
            String templateId = ScriptContentUtils.getTemplateId(context);
            final String postIndentStyle = """
                                      <style type="text/css">
                                            ${postNodeName} p:not(li>p):not(blockquote>p){text-indent: 2em;}
                                      </style>
                                      """;
            final String allIndentStyle = """
                                      <style type="text/css">
                                            ${postNodeName} p:not(li>p):not(blockquote>p){
                                                text-indent: 2em;
                                            }
                                            ${pageNodeName} p:not(li>p):not(blockquote>p){
                                                text-indent: 2em;
                                            }
                                      </style>
                                      """;
            if(miniTool.getContentIndent().getIsOnlyPostIndent().equals("onlyPost") && templateId.equals("post")){
                injectCode.append(PROPERTY_PLACEHOLDER_HELPER.replacePlaceholders(postIndentStyle, contentIndentProperties));
            }else if(miniTool.getContentIndent().getIsOnlyPostIndent().equals("globalPage")){
                contentIndentProperties.setProperty("pageNodeName", miniTool.getContentIndent().getPageIndentNodeName());
                injectCode.append(PROPERTY_PLACEHOLDER_HELPER.replacePlaceholders(allIndentStyle, contentIndentProperties));
            }
        }

        return injectCode.toString();
    }


}
