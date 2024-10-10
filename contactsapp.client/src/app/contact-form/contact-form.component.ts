import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Contact } from '../contact.model';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit, OnChanges {
  @Input() contact: Contact | null = null; // Receive the contact to edit
  @Output() contactAdded = new EventEmitter<Contact>(); // Emit the contact when submitted
  contactForm: FormGroup;
  submitButtonLabel = 'Add Contact';

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.setFormValues(this.contact);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contact'] && changes['contact'].currentValue) {
      this.setFormValues(changes['contact'].currentValue);
    }
  }

  // Set form values if a contact is passed in (for editing)
  public setFormValues(contact: Contact | null): void {
    if (contact) {
      this.submitButtonLabel = 'Update Contact';
      this.contactForm.patchValue({
        firstName: contact['firstName'],
        lastName: contact['lastName'],
        email: contact['email'],
        phone: contact['phone']
      });
      // Ensure ID is stored even if it's not displayed
      this.contactForm.addControl('id', this.fb.control(contact['id']));
    } else {
      this.submitButtonLabel = 'Add Contact';
      this.contactForm.reset(); // Reset if there's no contact (for adding new contact)
    }
  }

  submitForm(): void {
    if (this.contactForm.valid) {
      const formValue = this.contactForm.value;

      // Ensure we include the contact ID in the form submission, if editing
      if (this.contact && this.contact.id) {
        formValue.id = this.contact.id;
      }

      this.contactAdded.emit(formValue); // Emit the contact with ID if it exists
      this.contactForm.reset(); // Clear the form after submission
    }
  }
}
