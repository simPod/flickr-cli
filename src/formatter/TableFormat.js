class TableFormat {
    constructor(config) {
        this.applyDefaultConfiguration = this.applyDefaultConfiguration.bind(this);
        this.format = this.format.bind(this);
        this.displayHeaders = this.displayHeaders.bind(this);
        this.expandFields = this.expandFields.bind(this);
        this.isAllFields = this.isAllFields.bind(this);
        this.config = this.applyDefaultConfiguration(config);
    }

    applyDefaultConfiguration(config) {
        if (!config.separator) {
            config.separator = "\t";
        }
        if (!config.defaultFields) {
            config.defaultFields = ["*"];
        }
        if (config.displayHeaders === undefined) {
            config.displayHeaders = true;
        }
        if (!config.fields) {
            config.fields = config.defaultFields;
        }
        return config;
    }

    isAllFields(fields) {
        return fields.length === 1 && fields[0] === "*";
    }

    expandFields(sampleEntity) {
        if (this.isAllFields(this.config.fields)) {
            return Object.keys(sampleEntity)
        } else {
            return this.config.fields;
        }
    }

    displayHeaders(mappedFields) {
        return mappedFields.join(this.config.separator);
    };

    format(entities) {
        let includeHeaders = this.config.displayHeaders;
        const res = [];
        for (let entity of entities) {
            const mappedFields = this.expandFields(entity);
            if (includeHeaders) {
                res.push(this.displayHeaders(mappedFields));
                includeHeaders = false;
            }
            const fieldsValues = mappedFields.map((field) => entity[field]);
            res.push(fieldsValues.join(this.config.separator));
        }
        return res;
    }
}

module.exports = TableFormat;