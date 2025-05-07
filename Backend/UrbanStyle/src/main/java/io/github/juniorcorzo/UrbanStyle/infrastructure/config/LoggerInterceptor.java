package io.github.juniorcorzo.UrbanStyle.infrastructure.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.Instant;

@Component
@Slf4j
public class LoggerInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, @NotNull HttpServletResponse response, @NotNull Object handler) {
        log.info("[{}] Request received for the endpoint \"{}\"", request.getMethod(), request.getRequestURI());
        request.setAttribute("startTime", Instant.now().toEpochMilli());
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, @NotNull Object handler, Exception ex)  {
        long startTime = (long) request.getAttribute("startTime");
        log.info("Response {} sent for the endpoint \"{}\" in {} ms",
                HttpStatus.valueOf(response.getStatus()),
                request.getRequestURI(),
                Instant.now().toEpochMilli() - startTime
        );
    }
}
