const fs = require("fs/promises");
const path = require("path");
const contactsPath = path.resolve("./db/contacts.json");
const { v4: uuidv4 } = require("node-uuid");
require("colors");

function tryCatchWrapper(fn) {
  return function () {
    try {
      return fn.apply(this, arguments);
    } catch (error) {
      console.error(error);
    }
  };
}
async function getContacts() {
  const data = await fs.readFile(contactsPath, "utf8");
  const contacts = JSON.parse(data);
  return contacts;
}
async function listContacts() {
  const contacts = await getContacts();
  console.table(contacts);
  return;
}
async function getContactById(contactId) {
  const contacts = await getContacts();
  if (contacts.find(({ id }) => id === contactId)) {
    const findContact = contacts.filter(({ id }) => id === contactId);
    console.table(findContact);
    return;
  }
  const message = `Contact with id:${contactId} not found`;
  console.log(message.red);
}
async function removeContact(contactId) {
  const contacts = await getContacts();
  if (contacts.find(({ id }) => id === contactId)) {
    const updateContacts = contacts.filter(({ id }) => id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(updateContacts));
    console.log(`Contact with id:${contactId} deleted`.blue);
    console.table(updateContacts);
    return;
  }
  const message = `Contact with id:${contactId} not found`;
  console.log(message.red);
}
async function addContact(name, email, phone) {
  const contacts = await getContacts();
  const newContact = { id: uuidv4(), name, email, phone };
  if (contacts.find(({ name }) => newContact.name === name)) {
    const message = `Contact with this name:${name} already exists`;
    console.log(message.red);
    return;
  }
  const updateContacts = [...contacts, newContact];
  await fs.writeFile(contactsPath, JSON.stringify(updateContacts));
  const message = `Contact with name:${name} added successfully`;
  console.log(message.green);
  console.table(updateContacts);
  return;
}
const listContactsWrap = tryCatchWrapper(listContacts);
const getContactByIdWrap = tryCatchWrapper(getContactById);
const removeContactWrap = tryCatchWrapper(removeContact);
const addContactWrap = tryCatchWrapper(addContact);
module.exports = {
  listContactsWrap,
  getContactByIdWrap,
  removeContactWrap,
  addContactWrap,
};
