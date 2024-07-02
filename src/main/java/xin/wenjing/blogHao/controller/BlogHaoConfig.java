package xin.wenjing.blogHao.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import run.halo.app.plugin.ApiVersion;
import run.halo.app.plugin.ReactiveSettingFetcher;
import xin.wenjing.blogHao.entity.Settings;

/**
 * 相关配置信息获取
 * @author: dreamChaser
 * @date: 2024年06月23日 10:46
 */
@RequiredArgsConstructor
@ApiVersion("blogHao.wenjing.xin/v1alpha1")
@RequestMapping("/blogHaoConfig")
@RestController
public class BlogHaoConfig {

    private final ReactiveSettingFetcher reactiveSettingFetcher;

    @GetMapping("/slide-config")
    public Mono<Settings.SlideConfig> queryBaseConfigMsg() {
        Mono<Settings.SlideConfig> slideConfigMono =
            reactiveSettingFetcher.fetch(Settings.SlideConfig.GROUP_NAME, Settings.SlideConfig.class)
                .defaultIfEmpty(new Settings.SlideConfig())
                .map(item -> item);
        return slideConfigMono;
    }



}
