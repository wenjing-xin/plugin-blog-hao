package xin.wenjing.blogHao.processor;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
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

/**
 * 功能描述
 *
 * @author: dreamChaser
 * @date: 2024年06月20日 18:19
 */
@Component
@AllArgsConstructor
public class SlideProcessor implements TemplateHeadProcessor {

    private final ReactiveSettingFetcher settingFetcher;

    private final PluginContext pluginContext;

    @Override
    public Mono<Void> process(ITemplateContext context, IModel model, IElementModelStructureHandler structureHandler) {

        return settingFetcher.fetch(Settings.SlideConfig.GROUP_NAME, Settings.SlideConfig.class)
            .doOnNext( slideConfig -> {
                if(!slideConfig.isEnableSlide()){
                    return;
                }
                final IModelFactory modelFactory = context.getModelFactory();
                String version = pluginContext.getVersion();
                model.add(modelFactory.createText(ScriptContentUtils.slideScript(slideConfig, version)));
            }).then();

    }
}
