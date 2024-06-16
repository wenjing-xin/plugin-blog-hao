package xin.wenjing.blogHao.processor;

import lombok.AllArgsConstructor;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
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
import java.time.LocalDate;

/**
 * 功能描述
 *
 * @author: dreamChaser
 * @date: 2024年06月16日 19:50
 */
@Component
@AllArgsConstructor
public class ColorlessProcessor implements TemplateHeadProcessor {

    private final SettingFetcher settingFetcher;

    @Override
    public Mono<Void> process(ITemplateContext context, IModel model, IElementModelStructureHandler structureHandler) {

        Settings.MiniTool miniTool =settingFetcher.fetch(Settings.MiniTool.GROUP_NAME, Settings.MiniTool.class)
            .orElse(new Settings.MiniTool());
        LocalDate selfCloseAt = miniTool.getColorless().getSelfCloseAt();

        if(!miniTool.getColorless().isEnableColorless()){
            return Mono.empty();
        }

        if (selfCloseAt != null && selfCloseAt.isBefore(LocalDate.now())) {
            return Mono.empty();
        }

        String templateId = ScriptContentUtils.getTemplateId(context);
        boolean onlyIndex = BooleanUtils.isNotTrue(miniTool.getColorless().isColorlessScope());
        if(onlyIndex && !StringUtils.equals("index", templateId)){
            return Mono.empty();
        }
        final IModelFactory modelFactory = context.getModelFactory();
        return Mono.just(modelFactory.createText(ScriptContentUtils.colorlessStyle())).doOnNext(model::add).then();
    }

}
