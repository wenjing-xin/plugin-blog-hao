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
import run.halo.app.plugin.ReactiveSettingFetcher;
import run.halo.app.theme.dialect.TemplateHeadProcessor;
import xin.wenjing.blogHao.entity.Settings;
import xin.wenjing.blogHao.util.ScriptContentUtils;
import java.time.LocalDate;

/**
 * 功能描述
 * @author: dreamChaser
 * @date: 2024年06月16日 19:50
 */
@Component
@AllArgsConstructor
public class ColorlessProcessor implements TemplateHeadProcessor {

    private final ReactiveSettingFetcher settingFetcher;

    @Override
    public Mono<Void> process(ITemplateContext context, IModel model, IElementModelStructureHandler structureHandler) {

        return settingFetcher.fetch(Settings.MiniTool.GROUP_NAME, Settings.MiniTool.class)
            .doOnNext( miniTool -> {
                String scriptTmpl = colorLessScript(miniTool, context);
                final IModelFactory modelFactory = context.getModelFactory();
                model.add(modelFactory.createText(scriptTmpl));
            }).then();

    }

    public String colorLessScript(Settings.MiniTool miniTool, ITemplateContext context){

        LocalDate selfCloseAt = miniTool.getColorless().getSelfCloseAt();

        if(!miniTool.getColorless().isEnableColorless()){
            return "";
        }
        if (selfCloseAt != null && selfCloseAt.isBefore(LocalDate.now())) {
            return "";
        }
        String templateId = ScriptContentUtils.getTemplateId(context);
        boolean onlyIndex = BooleanUtils.isNotTrue(miniTool.getColorless().isColorlessScope());
        if(onlyIndex && !StringUtils.equals("index", templateId)){
            return "";
        }
        return ScriptContentUtils.colorlessStyle();
    }

}
