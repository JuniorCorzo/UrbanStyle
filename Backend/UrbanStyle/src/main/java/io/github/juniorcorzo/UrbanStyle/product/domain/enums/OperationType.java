package io.github.juniorcorzo.UrbanStyle.product.domain.enums;

public enum OperationType {
    INITIAL_STOCK {
        @Override
        public String getPerformedBy(String associateId) {
            return associateId;
        }

        @Override
        public String getReferenceBy(String associateId) {
            return null;
        }
    },

    MANUAL_ADJUSTMENT {
        @Override
        public String getPerformedBy(String associateId) {
            return associateId;
        }

        @Override
        public String getReferenceBy(String associateId) {
            return null;
        }
    },

    DELETE_ATTRIBUTE {
        @Override
        public String getPerformedBy(String associateId) {
            return associateId;
        }

        @Override
        public String getReferenceBy(String associateId) {
            return null;
        }
    },

    SALE {
        @Override
        public String getPerformedBy(String associateId) {
            return null;
        }

        @Override
        public String getReferenceBy(String associateId) {
            return associateId;
        }
    },

    ORDER_CANCELLATION {
        @Override
        public String getPerformedBy(String associateId) {
            return null;
        }

        @Override
        public String getReferenceBy(String associateId) {
            return associateId;
        }
    };

    public abstract String getPerformedBy(String associateId);

    public abstract String getReferenceBy(String associateId);
}

