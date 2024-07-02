package xin.wenjing.blogHao.processor;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.ITemplateContext;
import org.thymeleaf.model.IModel;
import org.thymeleaf.model.IModelFactory;
import org.thymeleaf.processor.element.IElementModelStructureHandler;
import reactor.core.publisher.Mono;
import run.halo.app.plugin.PluginContext;
import run.halo.app.theme.dialect.TemplateHeadProcessor;
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

    private final PluginContext pluginContext;

    @Override
    public Mono<Void> process(ITemplateContext context, IModel model,
        IElementModelStructureHandler structureHandler) {
        final IModelFactory modelFactory = context.getModelFactory();
        String version = pluginContext.getVersion();
        return Mono.just(modelFactory.createText(ScriptContentUtils.blogHaoEle(version)))
            .doOnNext(model::add)
            .then();
    }

}
