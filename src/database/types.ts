export interface NewsletterSubscriber {
  email: string;
  subscribedAt: Date;
  active: boolean;
  source: string;
  metadata?: {
    userAgent: string;
    ip: string;
  };
  resubscribedAt?: Date;
  unsubscribedAt?: Date;
}

export interface MongoDBConfig {
  uri: string;
  dbName: string;
}
