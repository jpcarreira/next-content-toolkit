interface NewsletterFormProps {
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
interface ContactModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    apiEndpoint?: string;
    title?: string;
    description?: string;
    onSuccess?: (data: {
        email: string;
        message: string;
    }) => void;
    onError?: (error: Error) => void;
}
interface SuccessMessageProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
}
interface EmailConfig {
    contactEmail: string;
    fromEmail: string;
    fromEmailAutoReply?: string;
}

export type { ContactModalProps, EmailConfig, NewsletterFormProps, SuccessMessageProps };
