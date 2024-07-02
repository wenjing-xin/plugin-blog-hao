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
 * 功能描述
 * 复制追加功能
 * @author: dreamChaser
 * @date: 2024年06月16日 00:21
 */
@Component
@AllArgsConstructor
public class CopyAddHeadProcessor implements TemplateHeadProcessor {

    private final ReactiveSettingFetcher settingFetcher;

    @Override
    public Mono<Void> process( ITemplateContext context, IModel model, IElementModelStructureHandler structureHandler) {
        return settingFetcher.fetch(Settings.CopyAdd.GROUP_NAME, Settings.CopyAdd.class)
                .doOnNext( copyAdd -> {
                    // 复制内容追加
                    if (copyAdd.isContentPageOnly() && ScriptContentUtils.notContentTemplate(context)) {
                        return;
                    }
                    String copyAddScript = ScriptContentUtils.copyAddScrProcess(copyAdd.getCopyAddContent(), copyAdd.getDivideType(), copyAdd.getCopyMinLength());
                    final IModelFactory modelFactory = context.getModelFactory();
                    model.add(modelFactory.createText(copyAddScript));
                }).then();

    }
}
