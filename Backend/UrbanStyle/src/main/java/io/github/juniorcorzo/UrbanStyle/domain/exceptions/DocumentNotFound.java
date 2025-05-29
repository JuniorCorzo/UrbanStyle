package io.github.juniorcorzo.UrbanStyle.domain.exceptions;

import io.github.juniorcorzo.UrbanStyle.domain.enums.DocumentsName;

public class DocumentNotFound extends RuntimeException {
    public DocumentNotFound(DocumentsName documentName, String id) {
        super(String.format("%s not found (ID:%s)", documentName.getName(), id));
    }

    public DocumentNotFound(DocumentsName documentName) {
        super(String.format("%s not found", documentName.getName()));
    }
}
