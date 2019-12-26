import { expect } from "chai";
import { Property } from "../src/Property";
import { Resource } from "../src";
import { Car } from "./entities/Car";
import { connect, close } from "./utils/testConnection";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";

describe("Property", () => {
    let columns: Array<ColumnMetadata>;

    before(async () => {
        await connect();
    });

    beforeEach(() => {
        columns = Car.getRepository().metadata.columns;
    });

    after(async () => {
        await Car.delete({});
        close();
    });

    describe("#name", () => {
        it("returns a name of the property", () => {
            const column = columns.find(c => c.propertyName === "id") as ColumnMetadata;
            expect(new Property(column, new Resource(Car), 0).name()).to.equal("id");
        });
    });

    describe("#path", () => {
        it("returns the path of the property", () => {
            const column = columns.find(c => c.propertyName === "name") as ColumnMetadata;
            expect(new Property(column, new Resource(Car), 0).path()).to.equal("name");
        });

        it("returns the path of the property", () => {
            const column = columns.find(c => c.propertyName === "carDealerId") as ColumnMetadata;
            expect(new Property(column, new Resource(Car), 0).path()).to.equal("carDealerId");
        });
    });

    describe("#isId", () => {
        it("returns true for primary key", () => {
            const column = columns.find(c => c.propertyName === "id") as ColumnMetadata;
            expect(new Property(column, new Resource(Car), 0).isId()).to.equal(true);
        });

        it("returns false for regular column", () => {
            const column = columns.find(c => c.propertyName === "name") as ColumnMetadata;
            expect(new Property(column, new Resource(Car), 0).isId()).to.equal(false);
        });
    });

    describe("#isEditable", () => {
        it("returns false for id field", async () => {
            const column = columns.find(c => c.propertyName === "id") as ColumnMetadata;
            expect(new Property(column, new Resource(Car), 0).isEditable()).to.equal(false);
        });

        it("returns false for createdAt and updatedAt fields", async () => {
            const createdAt = columns.find(c => c.propertyName === "createdAt") as ColumnMetadata;
            const updatedAt = columns.find(c => c.propertyName === "updatedAt") as ColumnMetadata;
            expect(new Property(createdAt, new Resource(Car), 0).isEditable()).to.equal(false);
            expect(new Property(updatedAt, new Resource(Car), 0).isEditable()).to.equal(false);
        });

        it("returns true for a regular field", async () => {
            const column = columns.find(c => c.propertyName === "name") as ColumnMetadata;
            expect(new Property(column, new Resource(Car), 0).isEditable()).to.equal(true);
        });
    });

    describe("#reference", () => {
        it("returns the name of the referenced resource if any", () => {
            const column = columns.find(c => c.propertyName === "carDealerId") as ColumnMetadata;
            expect(new Property(column, new Resource(Car), 0).reference()).to.equal("CarDealer");
        });

        it("returns null for regular field", () => {
            const column = columns.find(c => c.propertyName === "name") as ColumnMetadata;
            expect(new Property(column, new Resource(Car), 0).reference()).to.equal(null);
        });
    });

    describe("#availableValues", () => {
        it("returns null for regular field", () => {
            const column = columns.find(c => c.propertyName === "name") as ColumnMetadata;
            expect(new Property(column, new Resource(Car), 0).availableValues()).to.equal(null);
        });

        it("returns available values when enum is given", () => {
            const column = columns.find(c => c.propertyName === "carType") as ColumnMetadata;
            expect(new Property(column, new Resource(Car), 0).availableValues()).to.deep.equal([
                "modern", "old", "ghost"
            ]);
        });
    });
});