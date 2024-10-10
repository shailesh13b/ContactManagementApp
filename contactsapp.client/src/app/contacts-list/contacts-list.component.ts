import { Component, OnInit } from '@angular/core';
import { ContactService } from '../contact.service';
import { Observable } from 'rxjs';
import { Contact } from '../contact.model';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss']
})
export class ContactsListComponent implements OnInit {
  contacts$: Observable<Contact[]>;
  selectedContact: Contact | null = null; // Used for editing contacts
  showAddForm = false;

  feedbackMessage: string | null = null; // For user feedback
  timeoutId: any; // For tracking the timeout

  constructor(private contactService: ContactService) {
    this.contacts$ = this.contactService.contacts$;
  }

  ngOnInit(): void {
    this.contactService.getContacts();
  }

  // Trigger to add a new contact (open form with no contact)
  addNewContact(): void {
    this.clearFeedbackMessage(); // Clear any existing feedback before operation
    this.selectedContact = null;
    this.showAddForm = true;
  }

  // Trigger to edit an existing contact (pass selected contact to form)
  editContact(contact: Contact): void {
    this.clearFeedbackMessage(); // Clear any existing feedback before operation
    this.selectedContact = contact;
    this.showAddForm = true;
  }

  // Handle contact addition or update from child component
  handleContactAdded(newContact: Contact): void {
    this.clearFeedbackMessage(); // Clear any existing feedback before operation
    if (newContact.id) {
      // Update existing contact
      this.contactService.updateContact(newContact).subscribe(() => {
        this.contactService.getContacts(); // Refresh contacts after update
        this.displayFeedbackMessage('Contact updated successfully!');
      }, error => {
        console.error('Error updating contact:', error);
        this.displayFeedbackMessage('Failed to update contact.');
      });
    } else {
      // Add new contact
      this.contactService.addContact(newContact).subscribe(() => {
        this.contactService.getContacts(); // Refresh contacts after addition
        this.displayFeedbackMessage('Contact added successfully!');
      }, error => {
        console.error('Error adding contact:', error);
        this.displayFeedbackMessage('Failed to add contact.');
      });
    }

    this.showAddForm = false; // Hide the form
  }

  // Handle delete functionality
  deleteContact(id: number): void {
    this.clearFeedbackMessage(); // Clear any existing feedback before operation
    if (confirm('Are you sure you want to delete this contact?')) {
      this.contactService.deleteContact(id).subscribe(() => {
        this.contactService.getContacts(); // Refresh the contacts list after deletion
        this.displayFeedbackMessage('Contact deleted successfully!');
      }, error => {
        console.error('Error deleting contact:', error);
        this.displayFeedbackMessage('Failed to delete contact.');
      });
    }
  }

  // Method to display the feedback message and clear it after 3 seconds
  displayFeedbackMessage(message: string): void {
    this.feedbackMessage = message;
    this.timeoutId = setTimeout(() => {
      this.clearFeedbackMessage();
    }, 3000); // Clear message after 3 seconds
  }

  // Method to clear the feedback message and any pending timeouts
  clearFeedbackMessage(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId); // Cancel any existing timeout
    }
    this.feedbackMessage = null; // Clear the message
  }
}
