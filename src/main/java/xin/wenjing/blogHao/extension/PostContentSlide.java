package xin.wenjing.blogHao.extension;

import reactor.core.publisher.Mono;
import run.halo.app.theme.ReactivePostContentHandler;

/**
 * 功能描述
 * 文章内容页增加幻灯片
 * @author: dreamChaser
 * @date: 2024年06月18日 20:50
 */

public class PostContentSlide implements ReactivePostContentHandler {


    @Override
    public Mono<PostContentContext> handle(PostContentContext postContent) {
        return null;
    }
}
