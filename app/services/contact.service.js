const { ObjectId } = require("mongodb");

class ContactService {
    constructor(client) {
        this.Contact = client.db().collection("contacts");
    }
    // Helper method to extract contact data
    extractContactData(payload) {
        const contact = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            favorite: payload.favorite,
        };

        Object.keys(contact).forEach(
            (key) => contact[key] === undefined && delete contact[key]
        );

        return contact;
    }
    async create(payload) {
        const contact = this.extractContactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            contact,
            { $set: { favorite: contact.favorite === true } },
            { returnDocument: "after", upsert: true }
        );
        return result;
    }

    // Find contacts based on a filter
    async find(filter) {
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
    }

    // Find contacts by name
    async findByName(name) {
        return await this.find({
           name: { $regex: new RegExp(new RegExp(name)), $options: "i" },
        });
    }

    // Find a contact by ID
    async findById(id) {  
        return await this.Contact.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    // Update a contact by ID
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractContactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    // Delete a contact by ID
    async delete(id) {
        const result = await this.Contact.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    // Find all favorite contacts
    async findFavorite() {
        return await this.find({ favorite: true });
    }

    // Delete all contacts
    async deleteAll() {
        const result = await this.Contact.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = ContactService;
