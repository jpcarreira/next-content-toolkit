import { connectToDatabase } from './mongodb';
import type { NewsletterSubscriber } from './types';

export interface NewsletterServiceConfig {
  collectionName?: string;
  dbName?: string;
}

/**
 * Newsletter subscription service
 */
export class NewsletterService {
  private collectionName: string;
  private dbName?: string;

  constructor(config: NewsletterServiceConfig = {}) {
    this.collectionName = config.collectionName || 'newsletter_subscribers';
    this.dbName = config.dbName;
  }

  /**
   * Subscribe a new email to the newsletter
   */
  async subscribe(
    email: string,
    metadata?: { userAgent: string; ip: string }
  ): Promise<{ id: string; message: string }> {
    if (!email) {
      throw new Error('Email is required');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    const { db } = await connectToDatabase({ dbName: this.dbName });
    const collection = db.collection<NewsletterSubscriber>(this.collectionName);

    // Check if email already exists
    const existingSubscriber = await collection.findOne({ email });

    if (existingSubscriber) {
      // If already subscribed but inactive, reactivate
      if (!existingSubscriber.active) {
        await collection.updateOne(
          { email },
          {
            $set: {
              active: true,
              resubscribedAt: new Date(),
            },
          }
        );
        return {
          id: existingSubscriber._id?.toString() || '',
          message: 'Successfully resubscribed to newsletter',
        };
      }

      throw new Error('Email already subscribed');
    }

    // Insert new subscriber
    const result = await collection.insertOne({
      email,
      subscribedAt: new Date(),
      active: true,
      source: 'website',
      metadata,
    });

    return {
      id: result.insertedId.toString(),
      message: 'Successfully subscribed to newsletter',
    };
  }

  /**
   * Unsubscribe an email from the newsletter (soft delete)
   */
  async unsubscribe(email: string): Promise<{ message: string }> {
    if (!email) {
      throw new Error('Email is required');
    }

    const { db } = await connectToDatabase({ dbName: this.dbName });
    const collection = db.collection<NewsletterSubscriber>(this.collectionName);

    // Soft delete - mark as inactive instead of removing
    const result = await collection.updateOne(
      { email },
      {
        $set: {
          active: false,
          unsubscribedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      throw new Error('Email not found');
    }

    return { message: 'Successfully unsubscribed from newsletter' };
  }

  /**
   * Get all active subscribers
   */
  async getActiveSubscribers(): Promise<NewsletterSubscriber[]> {
    const { db } = await connectToDatabase({ dbName: this.dbName });
    const collection = db.collection<NewsletterSubscriber>(this.collectionName);

    return collection.find({ active: true }).toArray();
  }

  /**
   * Get subscriber count
   */
  async getSubscriberCount(): Promise<number> {
    const { db } = await connectToDatabase({ dbName: this.dbName });
    const collection = db.collection<NewsletterSubscriber>(this.collectionName);

    return collection.countDocuments({ active: true });
  }
}

/**
 * Create a newsletter service instance
 */
export function createNewsletterService(config?: NewsletterServiceConfig) {
  return new NewsletterService(config);
}
