using Microsoft.AspNetCore.Mvc;
using ContactsApp.Server.Controllers;
using ContactsApp.Server.Models;
using Newtonsoft.Json;

namespace ContactsControllerUnitTest
{
    public class ContactsControllerTests
    {
        private readonly ContactsController _controller;

        public ContactsControllerTests()
        {
            // Initialize the controller
            _controller = new ContactsController();
        }

        [Fact]
        public async Task GetContacts_ReturnsOkResult_WithListOfContacts()
        {
            // Arrange: Prepare isolated file for this test
            var filePath = "test_contacts.json";
            var mockContacts = new List<Contact>
        {
            new Contact { Id = 1, FirstName = "John", LastName = "Doe", Email = "john.doe@example.com", Phone = "1234567890" },
            new Contact { Id = 2, FirstName = "Jane", LastName = "Doe", Email = "jane.doe@example.com", Phone = "0987654321" }
        };
            await WriteMockDataToFile(mockContacts, filePath);

            // Act: Call the GetContacts method
            var result = await _controller.GetContacts();

            // Assert: Verify that the result is OK and contains contacts
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnContacts = Assert.IsType<List<Contact>>(okResult.Value);
            Assert.Equal(2, returnContacts.Count);

            // Clean up test data
            File.Delete(filePath);
        }

        [Fact]
        public async Task AddContact_ReturnsCreatedAtActionResult_WithNewContact()
        {
            // Arrange: Prepare isolated file for this test with a contact that has Id = 1
            var filePath = "test_contacts_add.json";
            var existingContacts = new List<Contact>
    {
        new Contact { Id = 1, FirstName = "Jane", LastName = "Doe", Email = "jane.doe@example.com", Phone = "0987654321" }
    };
            await WriteMockDataToFile(existingContacts, filePath);

            var newContact = new Contact { FirstName = "John", LastName = "Doe", Email = "john.doe@example.com", Phone = "1234567890" };

            // Act: Add the new contact
            var result = await _controller.AddContact(newContact);

            // Assert: Verify that the contact was added correctly
            var createdAtResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnContact = Assert.IsType<Contact>(createdAtResult.Value);
            Assert.Equal(2, returnContact.Id);  // Auto-incremented ID should be 2

            // Clean up test data
            File.Delete(filePath);
        }

        [Fact]
        public async Task UpdateContact_ReturnsNoContent_ForValidId()
        {
            // Arrange: Prepare isolated file for this test
            var filePath = "test_contacts_update.json";
            var existingContacts = new List<Contact>
        {
            new Contact { Id = 1, FirstName = "Jane", LastName = "Doe", Email = "jane.doe@example.com", Phone = "0987654321" }
        };
            await WriteMockDataToFile(existingContacts, filePath);

            var updatedContact = new Contact { Id = 1, FirstName = "John", LastName = "Doe", Email = "john.doe@example.com", Phone = "1234567890" };

            // Act: Update the contact
            var result = await _controller.UpdateContact(1, updatedContact);

            // Assert: Verify the contact was updated
            Assert.IsType<NoContentResult>(result);

            // Clean up test data
            File.Delete(filePath);
        }

        [Fact]
        public async Task UpdateContact_ReturnsNotFound_ForInvalidId()
        {
            // Arrange: Prepare isolated file for this test
            var filePath = "test_contacts_invalid_update.json";
            var existingContacts = new List<Contact>
        {
            new Contact { Id = 1, FirstName = "Jane", LastName = "Doe", Email = "jane.doe@example.com", Phone = "0987654321" }
        };
            await WriteMockDataToFile(existingContacts, filePath);

            var updatedContact = new Contact { Id = 2, FirstName = "John", LastName = "Doe", Email = "john.doe@example.com", Phone = "1234567890" };

            // Act: Attempt to update a non-existing contact
            var result = await _controller.UpdateContact(2, updatedContact);

            // Assert: Verify that a 404 Not Found is returned
            Assert.IsType<NotFoundResult>(result);

            // Clean up test data
            File.Delete(filePath);
        }

        [Fact]
        public async Task DeleteContact_ReturnsNoContent_ForValidId()
        {
            // Arrange: Prepare isolated file for this test
            var filePath = "test_contacts_delete.json";
            var existingContacts = new List<Contact>
        {
            new Contact { Id = 1, FirstName = "Jane", LastName = "Doe", Email = "jane.doe@example.com", Phone = "0987654321" }
        };
            await WriteMockDataToFile(existingContacts, filePath);

            // Act: Delete the contact
            var result = await _controller.DeleteContact(1);

            // Assert: Verify the contact was deleted
            Assert.IsType<NoContentResult>(result);

            // Clean up test data
            File.Delete(filePath);
        }

        [Fact]
        public async Task DeleteContact_ReturnsNotFound_ForInvalidId()
        {
            // Arrange: Prepare isolated file for this test with a contact that has Id = 1
            var filePath = "test_contacts_invalid_delete.json";
            var existingContacts = new List<Contact>
    {
        new Contact { Id = 1, FirstName = "Jane", LastName = "Doe", Email = "jane.doe@example.com", Phone = "0987654321" }
    };
            await WriteMockDataToFile(existingContacts, filePath);

            // Act: Attempt to delete a contact with Id = 2 (which doesn't exist)
            var result = await _controller.DeleteContact(2);

            // Assert: Verify that a 404 Not Found is returned
            Assert.IsType<NotFoundResult>(result);

            // Clean up test data
            File.Delete(filePath);
        }

        // Helper method to write mock data to a temporary file for each test
        private async Task WriteMockDataToFile(List<Contact> contacts, string filePath)
        {
            var contactsJson = JsonConvert.SerializeObject(contacts, Formatting.Indented);
            await File.WriteAllTextAsync(filePath, contactsJson);
        }
    }
}
