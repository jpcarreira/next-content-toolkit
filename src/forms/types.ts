export interface NewsletterFormProps {
  apiEndpoint?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  successTitle?: string;
  successDescription?: string;
  className?: string;
  onSuccess?: (email: string) => void;
  onError?: (error: Error) => void;
}

export interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiEndpoint?: string;
  title?: string;
  description?: string;
  onSuccess?: (data: { email: string; message: string }) => void;
  onError?: (error: Error) => void;
  className?: string;
  overlayClassName?: string;
  buttonClassName?: string;
  inputClassName?: string;
  textareaClassName?: string;
  labelClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  iconColor?: string;
}

export interface SuccessMessageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface EmailConfig {
  contactEmail: string;
  fromEmail: string;
  fromEmailAutoReply?: string;
}
