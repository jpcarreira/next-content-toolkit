import { NewsletterSubscriber } from './types';

interface NewsletterServiceConfig {
    collectionName?: string;
    dbName?: string;
}
/**
 * Newsletter subscription service
 */
declare class NewsletterService {
    private collectionName;
    private dbName?;
    constructor(config?: NewsletterServiceConfig);
    /**
     * Subscribe a new email to the newsletter
     */
    subscribe(email: string, metadata?: {
        userAgent: string;
        ip: string;
    }): Promise<{
        id: string;
        message: string;
    }>;
    /**
     * Unsubscribe an email from the newsletter (soft delete)
     */
    unsubscribe(email: string): Promise<{
        message: string;
    }>;
    /**
     * Get all active subscribers
     */
    getActiveSubscribers(): Promise<NewsletterSubscriber[]>;
    /**
     * Get subscriber count
     */
    getSubscriberCount(): Promise<number>;
}
/**
 * Create a newsletter service instance
 */
declare function createNewsletterService(config?: NewsletterServiceConfig): NewsletterService;

export { NewsletterService, type NewsletterServiceConfig, createNewsletterService };
