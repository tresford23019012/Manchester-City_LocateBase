package com.locatebase.api.guesthouse;

public enum GuesthouseStatus {
    DRAFT,      // created by staff, not public yet
    ACTIVE,     // visible to everyone
    SUSPENDED   // hidden, e.g. for late payment
}