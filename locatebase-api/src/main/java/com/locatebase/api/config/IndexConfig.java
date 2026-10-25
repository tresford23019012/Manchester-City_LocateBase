package com.locatebase.api.config;

import com.mongodb.client.model.IndexOptions;
import org.bson.Document;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

// Creates the database indexes when the app starts. Creating one that already exists does nothing.
@Component
public class IndexConfig implements ApplicationRunner {

    private final MongoTemplate mongo;

    public IndexConfig(MongoTemplate mongo) {
        this.mongo = mongo;
    }

    @Override
    public void run(ApplicationArguments args) {
        // one user record per Firebase account
        mongo.getCollection("users")
                .createIndex(new Document("firebaseUid", 1), new IndexOptions().unique(true));

        // lets MongoDB answer "which guesthouses are near this point" quickly
        mongo.getCollection("guesthouses")
                .createIndex(new Document("location", "2dsphere"));
    }
}