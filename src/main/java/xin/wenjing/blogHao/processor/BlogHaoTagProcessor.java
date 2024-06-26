package xin.wenjing.blogHao.processor;

import lombok.AllArgsConstructor;
import org.pf4j.PluginWrapper;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.ITemplateContext;
import org.thymeleaf.model.IModel;
import org.thymeleaf.model.IModelFactory;
import org.thymeleaf.processor.element.IElementModelStructureHandler;
import reactor.core.publisher.Mono;
import run.halo.app.plugin.SettingFetcher;
import run.halo.app.theme.dialect.TemplateHeadProcessor;
import xin.wenjing.blogHao.entity.Settings;
import xin.wenjing.blogHao.util.InferStream;
import xin.wenjing.blogHao.util.ScriptContentUtils;

/**
 * 功能描述
 * 自定义元素注入
 * @author: dreamChaser
 * @date: 2024年06月19日 14:08
 */
@Component
@AllArgsConstructor
public class BlogHaoTagProcessor implements TemplateHeadProcessor {

    private final SettingFetcher settingFetcher;

    private final PluginWrapper pluginWrapper;

    @Override
    public Mono<Void> process(ITemplateContext context, IModel model,
        IElementModelStructureHandler structureHandler) {
        final IModelFactory modelFactory = context.getModelFactory();

        return InferStream.<Void>infer(true)
            .success(() -> settingFetcher
                .fetch("miniTools", Settings.MiniTool.class)
                .map(config -> {
                    model.add(modelFactory.createText(
                        ScriptContentUtils.blogHaoEle(pluginWrapper.getDescriptor().getVersion()
                        )));
                    return Mono.empty();
                })
                .orElse(Mono.empty()).then()).last();
    }


}
