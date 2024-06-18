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
import xin.wenjing.blogHao.util.ScriptContentUtils;

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

        String scriptRes = finalScript(context);

        if(scriptRes == null && scriptRes.length() == 0){
            return Mono.empty();
        }

        final IModelFactory modelFactory = context.getModelFactory();
        return Mono.just(modelFactory.createText(scriptRes)).doOnNext(model::add).then();
    }

    private String finalScript(ITemplateContext context) {

        StringBuilder injectCode = new StringBuilder();
        Settings.CopyAdd copyAdd = settingFetcher.fetch(Settings.CopyAdd.GROUP_NAME, Settings.CopyAdd.class)
            .orElse(new Settings.CopyAdd());
        Settings.MiniTool miniTool =settingFetcher.fetch(Settings.MiniTool.GROUP_NAME, Settings.MiniTool.class)
            .orElse(new Settings.MiniTool());

        // 复制内容追加
        if(copyAdd.isContentPageOnly() && ScriptContentUtils.notContentTemplate(context)){
            injectCode.append("");
        }else{
            String copyAddScript = ScriptContentUtils.copyAddScrProcess(copyAdd.getCopyAddContent(), copyAdd.getDivideType(), copyAdd.getCopyMinLength());
            injectCode.append(copyAddScript);
        }

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
        // 幻灯片相关文件，只为文章页面和单独页面添加
        if(!ScriptContentUtils.notContentTemplate(context)) {
            injectCode.append("""
                <link rel="stylesheet" type="text/css" href="https://unpkg.com/webppt@1.0.11/dist/style.css" />
                <script src="https://unpkg.com/webppt@1.0.11/dist/index.min.js" data-pjax></script>
                """);
        }
        return injectCode.toString();
    }


}
