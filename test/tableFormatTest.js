const TableFormat = require("../src/formatter/TableFormat");

describe("Table formatter", () => {
    const test = (config, expectedFormat) => {
        const entities = [
            { title: "test", id: "123123", description: "prout" },
            { title: "second", id: "456456", description: "pouet" }
        ];
        const formatter = new TableFormat(config);
        const res = formatter.format(entities);

        for (let entity of entities) {
            should(res).containEql(expectedFormat(entity));
        }
        return res;
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
        const res = test(config, (entity) => `${entity.title}\t${entity.id}`);
        should(res[0]).equal("title\tid");
    });

    it("should list entities with headers with all fields", async () => {
        const config = { defaultFields: ["title"], fields: ["*"], displayHeaders: true };
        const res = test(config, (entity) => `${entity.title}\t${entity.id}\t${entity.description}`);
        should(res[0]).equal("title\tid\tdescription");
    });

    it("should list entities without headers with all fields", async () => {
        const config = { defaultFields: ["title"], fields: ["*"], displayHeaders: false };
        const res = test(config, (entity) => `${entity.title}\t${entity.id}\t${entity.description}`);
        should(res).not.containEql("title\tid\tdescription");
    });
    it("should list entities with headers by default", async () => {
        const config = { defaultFields: ["title"], fields: ["*"] };
        const res = test(config, (entity) => `${entity.title}\t${entity.id}\t${entity.description}`);
        should(res[0]).equal("title\tid\tdescription");
    });
    it("should list entities with specified separator", async () => {
        const config = { defaultFields: ["title"], fields: ["*"], separator: ';' };
        const res = test(config, (entity) => `${entity.title};${entity.id};${entity.description}`);
        should(res[0]).equal("title;id;description");
    });
});