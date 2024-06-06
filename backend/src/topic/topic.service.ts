import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Topic } from './topic.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTopicDto } from './create-topic.dto';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>,
  ) {}

  async find(id: number): Promise<Topic> {
    return this.topicRepository.findOne({
      where: { id },
    });
  }
  async create(topic: CreateTopicDto): Promise<Topic> {
    const createdTopic = this.topicRepository.create(topic);
    return this.topicRepository.save(createdTopic);
  }

  async update(topic: Topic): Promise<Topic> {
    return this.topicRepository.save(topic);
  }

}
