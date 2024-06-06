import { Body, Controller, Post } from '@nestjs/common';
import { TopicService } from './topic.service';

@Controller('topic')
export class TopicController {
  constructor(private topicService: TopicService) {}
  @Post('add_file')
  addFile(@Body() body) {
    const file_id = body.file_id;
    console.log("trying to add file", file_id)
  }
}
