import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitterApi } from 'twitter-api-v2';
import { TweetsService } from './tweets.service';

@Injectable()
export class TwitterService {
  twitterClient: TwitterApi;

  constructor(private config: ConfigService, private mongo: TweetsService) {
    this.twitterClient = new TwitterApi(
      this.config.get('TWITTER_BEARER_TOKEN'),
    );
  }

  async getSearchStream() {
    const stream = this.twitterClient.v2.searchStream({
      expansions: ['author_id', 'entities.mentions.username'],
      'tweet.fields': [
        'created_at',
        'text',
        'author_id',
        'referenced_tweets',
        'entities',
        'context_annotations',
      ],
      'user.fields': ['created_at', 'username', 'location', 'entities'],
      autoConnect: false,
    });

    await stream.connect({
      autoReconnect: true,
      autoReconnectRetries: Infinity,
      keepAliveTimeout: Infinity,
    });

    for await (const { data, includes } of stream) {
      this.mongo.create(data, includes);
    }
  }
}