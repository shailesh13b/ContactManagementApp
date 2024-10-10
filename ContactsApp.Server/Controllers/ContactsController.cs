using ContactsApp.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace ContactsApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactsController : ControllerBase
    {
        private readonly string _dataFile = "Data/contacts.json";

        // GET: api/contacts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContacts()
        {
            var contacts = await ReadContactsFromFile();
            return Ok(contacts);
        }

        // POST: api/contacts
        [HttpPost]
        public async Task<ActionResult<Contact>> AddContact(Contact contact)
        {
            var contacts = await ReadContactsFromFile();
            // Handle the case where there are no contacts in the file
            contact.Id = contacts.Count > 0 ? contacts.Max(c => c.Id) + 1 : 1;
            contacts.Add(contact);

            await WriteContactsToFile(contacts);
            return CreatedAtAction(nameof(GetContacts), new { id = contact.Id }, contact);
        }

        // PUT: api/contacts/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateContact(int id, Contact contact)
        {
            var contacts = await ReadContactsFromFile();
            var contactToUpdate = contacts.FirstOrDefault(c => c.Id == id);

            if (contactToUpdate == null)
            {
                return NotFound();
            }

            contactToUpdate.FirstName = contact.FirstName;
            contactToUpdate.LastName = contact.LastName;
            contactToUpdate.Email = contact.Email;
            contactToUpdate.Phone = contact.Phone;

            await WriteContactsToFile(contacts);
            return NoContent();
        }

        // DELETE: api/contacts/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            var contacts = await ReadContactsFromFile();
            var contactToRemove = contacts.FirstOrDefault(c => c.Id == id);

            if (contactToRemove == null)
            {
                return NotFound();
            }

            contacts.Remove(contactToRemove);
            await WriteContactsToFile(contacts);

            return NoContent();
        }

        // Helper methods to read and write from the JSON file
        private async Task<List<Contact>> ReadContactsFromFile()
        {
            if (!System.IO.File.Exists(_dataFile))
            {
                return new List<Contact>();
            }

            var contactsJson = await System.IO.File.ReadAllTextAsync(_dataFile);
            return JsonConvert.DeserializeObject<List<Contact>>(contactsJson) ?? new List<Contact>();
        }

        private async Task WriteContactsToFile(List<Contact> contacts)
        {
            var contactsJson = JsonConvert.SerializeObject(contacts, Newtonsoft.Json.Formatting.Indented);
            await System.IO.File.WriteAllTextAsync(_dataFile, contactsJson);
        }
    }
}
