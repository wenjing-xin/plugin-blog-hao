package xin.wenjing.blogHao.util;

import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Supplier;

/**
* 功能描述
* InferStream采用Reactor响应式流实现多推断表达式结果存储
* @author: dreamChaser
* @date: 2024/6/20 18:18
*/
public class InferStream<T> {
    private boolean trigger = false;
    private final List<Mono<T>> monoList = new ArrayList<>();

    private InferStream() {}

    public static <T> InferStream<T>.Action<T> infer(boolean trigger) {
        return new InferStream<T>().ofInstance(trigger);
    }

    public static <T> InferStream<T>.Action<T> infer(Supplier<Boolean> supplier) {
        return new InferStream<T>().ofInstance(supplier.get());
    }

    private Action<T> ofInstance(boolean trigger) {
        this.trigger = trigger;
        return new Action<>();
    }

    public class Action<U extends T> {
        @SuppressWarnings("unchecked")
        public Action<U> success(Supplier<Mono<U>> supplier) {
            if (trigger) {
                monoList.add((Mono<T>) supplier.get());
            }
            return this;
        }

        public Action<U> success(Runnable function) {
            if (trigger) {
                function.run();
            }
            return this;
        }

        @SuppressWarnings("unchecked")
        public Action<U> fail(Supplier<Mono<U>> supplier) {
            if (!trigger) {
                monoList.add((Mono<T>) supplier.get());
            }
            return this;
        }

        public Action<U> fail(Runnable function) {
            if (!trigger) {
                function.run();
            }
            return this;
        }

        public Action<U> infer(boolean trigger) {
            InferStream.this.trigger = trigger;
            return this;
        }

        public Action<U> infer(Supplier<Boolean> supplier) {
            InferStream.this.trigger = supplier.get();
            return this;
        }

        public List<Mono<T>> collect() {
            return monoList;
        }

        public Mono<T> first() {
            return get(0);
        }

        public Mono<T> last() {
            return get(monoList.size() - 1);
        }

        public Mono<T> get(int index) {
            if (monoList.isEmpty()) {return Mono.empty();}
            return monoList.get(index);
        }
    }
}
