package io.github.juniorcorzo.UrbanStyle.domain.exceptions;

import io.github.juniorcorzo.UrbanStyle.domain.enums.DocumentsName;

public class DeleteDocumentFailed extends RuntimeException {
    public DeleteDocumentFailed(DocumentsName documentsName, String id) {
        super(String.format("Failed to delete %s (ID:%s)", documentsName.getName(), id));
    }
}
