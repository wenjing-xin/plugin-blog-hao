package xin.wenjing.blogHao.processor;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.ITemplateContext;
import org.thymeleaf.model.IModel;
import org.thymeleaf.model.IModelFactory;
import org.thymeleaf.processor.element.IElementModelStructureHandler;
import reactor.core.publisher.Mono;
import run.halo.app.plugin.ReactiveSettingFetcher;
import run.halo.app.theme.dialect.TemplateHeadProcessor;
import xin.wenjing.blogHao.entity.Settings;
import xin.wenjing.blogHao.util.ScriptContentUtils;

/**
 * 小工具脚本注入
 * @author: dreamChaser
 * @date: 2024年06月16日 00:21
 */
@Component
@AllArgsConstructor
public class MiniToolsProcessor implements TemplateHeadProcessor {

    private final ReactiveSettingFetcher settingFetcher;

    @Override
    public Mono<Void> process(ITemplateContext context, IModel model, IElementModelStructureHandler structureHandler) {
        return settingFetcher.fetch(Settings.MiniTool.GROUP_NAME, Settings.MiniTool.class)
            .doOnNext( miniTool -> {
                String scriptRes = miniToolsScript( miniTool);
                final IModelFactory modelFactory = context.getModelFactory();
                model.add(modelFactory.createText(scriptRes));
            }).then();
    }

    private String miniToolsScript(Settings.MiniTool miniTool) {

        StringBuilder injectCode = new StringBuilder("");
        // 中英文空格脚本
        if(miniTool.getContentSpace().isEnableContentSpace()){
            injectCode.append(ScriptContentUtils.panguScript(miniTool));
        }
        // 段落内容首行缩进
        if(miniTool.getContentIndent().isEnableContentIndent()){
            injectCode.append("""
                              <style type="text/css"> %s p:not(li>p):not(blockquote>p){text-indent: 2em;} </style>
                              """.formatted(miniTool.getContentIndent().getIndentNodeName()));
        }
        return injectCode.toString();
    }


}
