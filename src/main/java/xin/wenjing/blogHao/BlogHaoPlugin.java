package xin.wenjing.blogHao;

import org.springframework.stereotype.Component;
import run.halo.app.plugin.BasePlugin;
import run.halo.app.plugin.PluginContext;

/**
* 功能描述
* 启动入口
* @author: dreamChaser的小屋
* @date: 2024/6/22 16:56
*/
@Component
public class BlogHaoPlugin extends BasePlugin {

    public BlogHaoPlugin(PluginContext pluginContext) {
        super(pluginContext);
    }

    @Override
    public void start() {
        System.out.println("插件启动成功！");
    }

    @Override
    public void stop() {
        System.out.println("插件停止！");
    }
}
