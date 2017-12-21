const td = require("testdouble");
const TableFormat = require("../src/utils/TableFormat");

describe("Table formatter", () => {
    const test = (config, expectedFormat) => {
        const entities = [
            { title: "test", id: "123123", description: "prout" },
            { title: "second", id: "456456", description: "pouet"}
        ];
        const callback = td.function();
        const formatter = new TableFormat(callback, config);
        formatter.format(entities);

        for(let entity of entities) {
            td.verify(callback(expectedFormat(entity)));
        }
        return callback;
    };

    it("should display entities with default field", () => {
        const config = { defaultFields: ["title"] };
        test(config, (entity) => entity.title);
    });

    it("should list entities with all fields", async () => {
        const config = { fields: ["*"] };
        test(config, (entity) => `${entity.title}\t${entity.id}\t${entity.description}`);
    });

    it("should list entities with specified fields", async () => {
        const config = { defaultFields: ["title"], fields: ["title", "id"] };
        test(config, (entity) => `${entity.title}\t${entity.id}`);
    });

    it("should list entities with headers when fields are specified", async () => {
        const config = { defaultFields: ["title"], fields: ["title", "id"], displayHeaders: true };
        const callback = test(config, (entity) => `${entity.title}\t${entity.id}`);
        td.verify(callback("title\tid"));
    });

    it("should list entities with headers with all fields", async () => {
        const config = { defaultFields: ["title"], fields: ["*"], displayHeaders: true };
        const callback = test(config, (entity) => `${entity.title}\t${entity.id}\t${entity.description}`);
        td.verify(callback("title\tid\tdescription"));
    });

    it("should list entities without headers with all fields", async () => {
        const config = { defaultFields: ["title"], fields: ["*"], displayHeaders: false };
        const callback = test(config, (entity) => `${entity.title}\t${entity.id}\t${entity.description}`);
        td.verify(callback("title\tid\tdescription"), {times: 0});
    });
    it("should list entities with headers by default", async () => {
        const config = { defaultFields: ["title"], fields: ["*"]};
        const callback = test(config, (entity) => `${entity.title}\t${entity.id}\t${entity.description}`);
        td.verify(callback("title\tid\tdescription"), {times: 1});
    });
});