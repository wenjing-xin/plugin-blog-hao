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

    private final SettingFetcher settingFetcher;

    private final PluginWrapper pluginWrapper;

    @Override
    public Mono<Void> process(ITemplateContext context, IModel model, IElementModelStructureHandler structureHandler) {

        Settings.SlideConfig slideConfig =settingFetcher.fetch(Settings.SlideConfig.GROUP_NAME, Settings.SlideConfig.class)
            .orElse(new Settings.SlideConfig());

        if(!slideConfig.isEnableSlide()){
            return Mono.empty();
        }

        boolean singlePageOrPost = ScriptContentUtils.notContentTemplate(context);
        if(singlePageOrPost){
            return Mono.empty();
        }
        final IModelFactory modelFactory = context.getModelFactory();
        return Mono.just(modelFactory.createText(ScriptContentUtils.slideScript(slideConfig, pluginWrapper.getDescriptor().getVersion()))).doOnNext(model::add).then();
    }
}
