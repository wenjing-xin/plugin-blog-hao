package xin.wenjing.blogHao.processor;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.ITemplateContext;
import org.thymeleaf.model.IModel;
import org.thymeleaf.model.IModelFactory;
import org.thymeleaf.processor.element.IElementModelStructureHandler;
import reactor.core.publisher.Mono;
import run.halo.app.plugin.SettingFetcher;
import run.halo.app.theme.dialect.TemplateHeadProcessor;
import xin.wenjing.blogHao.entity.Settings;
import xin.wenjing.blogHao.util.ContentUtils;

/**
 * 功能描述
 * 全局脚本注入
 * @author: dreamChaser
 * @date: 2024年06月16日 00:21
 */
@Component
@AllArgsConstructor
public class GlobalInjectProcessor implements TemplateHeadProcessor {

    private final SettingFetcher settingFetcher;

    @Override
    public Mono<Void> process(ITemplateContext context, IModel model, IElementModelStructureHandler structureHandler) {

        Settings.CopyAdd copyAdd = settingFetcher
            .fetch(Settings.CopyAdd.GROUP_NAME, Settings.CopyAdd.class)
            .orElse(new Settings.CopyAdd());

        if(copyAdd.getContentPageOnly() && ContentUtils.notContentTemplate(context)){
            return Mono.empty();
        }

        String copyAddScript = ContentUtils.copyAddScrProcess(copyAdd.getCopyAddContent(), copyAdd.getDivideType(), copyAdd.getCopyMinLength());
        final IModelFactory modelFactory = context.getModelFactory();
        return Mono.just(modelFactory.createText(copyAddScript)).doOnNext(model::add).then();
    }


}
