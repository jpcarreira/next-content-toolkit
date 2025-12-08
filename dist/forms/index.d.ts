import * as react_jsx_runtime from 'react/jsx-runtime';
import { NewsletterFormProps, ContactModalProps, SuccessMessageProps } from './types';
export { EmailConfig } from './types';
export { createEmailConfig, getEmailConfig, sendContactEmail } from './email';

/**
 * Newsletter subscription form component
 * Requires Button and Input components from your UI library
 */
declare function NewsletterForm({ apiEndpoint, title, description, buttonText, successTitle, successDescription, className, onSuccess, onError, }: NewsletterFormProps): react_jsx_runtime.JSX.Element;

/**
 * Contact form modal component
 * Note: This component uses basic HTML elements.
 * For production, replace with your UI library's Dialog/Modal component
 */
declare function ContactModal({ open, onOpenChange, apiEndpoint, title, description, onSuccess, onError, className, overlayClassName, buttonClassName, inputClassName, textareaClassName, labelClassName, titleClassName, descriptionClassName, iconColor, }: ContactModalProps): react_jsx_runtime.JSX.Element | null;

/**
 * Success message component for forms
 */
declare function SuccessMessage({ title, description, icon }: SuccessMessageProps): react_jsx_runtime.JSX.Element;

export { ContactModal, ContactModalProps, NewsletterForm, NewsletterFormProps, SuccessMessage, SuccessMessageProps };
