package com.locatebase.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//it tells spring that the class holds setting, so it must be loaded when the app starts
@Configuration 

//implemented so we can add our own CORS rules
public class CorsConfig implements WebMvcConfigurer {
    
    //this method is called ny Spring so we can add the CORS rules
    @Override 
    public void addCorsMappings(CorsRegistry registry){

        //the rules applies to every request that starts with API
        registry.addMapping("/api/**")

            //web addresses that are allowed to access the API
                .allowedOrigins(
                    "http://localhost:5173",
                    "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174")

                //Requests the web app can send
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")

                //lets the web app send any header
                .allowedHeaders("*")

                //the browser may remeber the CORS setting for 3600 seconds (1 hour)
                .maxAge(3600);
    }

    
}
