const TableFormat = require("./TableFormat");
module.exports = class {
    constructor() {
        this.getFormatter = this.getFormatter.bind(this);
        this.createTableFormatter = this.createTableFormatter.bind(this);
    }

    getFormatter(formatterName, options) {
        switch (formatterName) {
            case "table":
            default:
                return this.createTableFormatter(options);
        }
    }

    expandFields(fields) {
        return fields.map(field => {
            if (field.value.indexOf(",") >= 0) {
                return field.value.split(",");
            } else {
                return [field.value];
            }
        }).reduce((arr, curr) => arr.concat(curr), []);
    }

    createTableFormatter(options) {
        const fields = options.field ? this.expandFields(options.field) : ["title"];
        return new TableFormat({
            fields,
            separator: options.separator ? options.separator.value : '\t',
            displayHeaders: options["no-headers"] ? !(options["no-headers"].value) : true
        });
    }
}